import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";
import { AuthContext } from "../../App";
import colors from "../assets/colors/colors";
import * as ImagePicker from "expo-image-picker";

// Reusable form input component
interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  editable?: boolean;
  onPressIn?: () => void;
}

const FormInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
  onPressIn,
}: FormInputProps) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    editable={editable}
    onPressIn={onPressIn}
  />
);

// Wine type selection modal
interface WineTypeModalProps {
  visible: boolean;
  selectedType: string;
  onSelect: (type: string) => void;
  onClose: () => void;
}

const WineTypeModal = ({
  visible,
  selectedType,
  onSelect,
  onClose,
}: WineTypeModalProps) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
        <Text style={styles.modalTitle}>Select Wine Type</Text>
        <Picker selectedValue={selectedType} onValueChange={onSelect}>
          <Picker.Item label="Select a type" value="" />
          <Picker.Item label="Red" value="Red" />
          <Picker.Item label="White" value="White" />
          <Picker.Item label="Rose" value="Rose" />
          <Picker.Item label="Sparkling" value="Sparkling" />
          <Picker.Item label="Fortified" value="Fortified" />
        </Picker>
        <Button title="Done" onPress={onClose} />
      </View>
    </TouchableOpacity>
  </Modal>
);

function Home() {
  const db = useSQLiteContext();
  const { currentUser } = useContext(AuthContext);

  // Form state variables
  const [wineMaker, setWineMaker] = useState("");
  const [wineName, setWineName] = useState("");
  const [grape, setGrape] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [labelImage, setLabelImage] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // Request camera and media library permissions when component mounts
  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert(
          "Permission Required",
          "Camera access is required to take pictures of wine labels.",
          [{ text: "OK" }]
        );
      }

      if (!mediaLibraryPermission.granted) {
        Alert.alert(
          "Permission Required",
          "Media library access is required to save wine label images.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  // Launch the camera to take a picture
  const handleTakePicture = async () => {
    try {
      // Check permissions again before launching camera
      const { status: cameraStatus } =
        await ImagePicker.getCameraPermissionsAsync();

      if (cameraStatus !== "granted") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera permissions to take pictures."
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setLabelImage(uri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert(
        "Camera Error",
        "There was a problem accessing the camera. Please check your permissions."
      );
    }
  };

  // Reset form fields after successful submission
  const resetForm = () => {
    setWineMaker("");
    setWineName("");
    setGrape("");
    setType("");
    setYear("");
    setRating("");
    setRegion("");
    setNotes("");
    setLabelImage(null);
  };

  // Insert wine record into the database
  const handleAddWine = async () => {
    if (!currentUser) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    if (
      !wineMaker ||
      !wineName ||
      !grape ||
      !type ||
      !year ||
      !rating ||
      !region
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      await db.runAsync(
        "INSERT INTO Wine (wineMaker, wineName, grape, type, year, rating, region, notes, userId, labelImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          wineMaker,
          wineName,
          grape,
          type,
          parseInt(year),
          parseFloat(rating),
          region,
          notes,
          currentUser.id,
          labelImage,
        ]
      );
      Alert.alert("Success", "Wine added to your cellar!");
      resetForm();
    } catch (error) {
      console.error("Error adding wine:", error);
      Alert.alert("Error", "Could not add wine. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title}>SIP & STORE</Text>
          <Text style={styles.subtitle}>
            Capture your wine's story — snap a label, log the details, and rate
            every sip.
          </Text>
          <FormInput
            placeholder="Wine Maker"
            value={wineMaker}
            onChangeText={setWineMaker}
          />
          <FormInput
            placeholder="Wine Name"
            value={wineName}
            onChangeText={setWineName}
          />
          <FormInput
            placeholder="Grape Variety"
            value={grape}
            onChangeText={setGrape}
          />
          <FormInput
            placeholder="Wine Type (Tap to select)"
            value={type}
            editable={false}
            onPressIn={() => setShowTypePicker(true)}
            onChangeText={setType}
          />
          <FormInput
            placeholder="Year"
            value={year}
            keyboardType="numeric"
            onChangeText={setYear}
          />
          <FormInput
            placeholder="Rating (1-5)"
            value={rating}
            keyboardType="numeric"
            onChangeText={setRating}
          />
          <FormInput
            placeholder="Region"
            value={region}
            onChangeText={setRegion}
          />
          <FormInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />

          {/* Display image preview if available */}
          {labelImage && (
            <Image source={{ uri: labelImage }} style={styles.labelPreview} />
          )}

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleTakePicture}
          >
            <Text style={styles.buttonText}>ADD LABEL PHOTOGRAPH</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAddWine}>
            <Text style={styles.buttonText}>ADD WINE</Text>
          </TouchableOpacity>

          {/* Add extra space at the bottom for scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        <WineTypeModal
          visible={showTypePicker}
          selectedType={type}
          onSelect={setType}
          onClose={() => setShowTypePicker(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.seashell,
  },
  container: {
    flex: 1,
    backgroundColor: colors.seashell,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Extra padding at the bottom
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "medium",
    marginBottom: 16,
    fontFamily: "Montserrat",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  labelPreview: {
    width: 200,
    height: 150,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cameraButton: {
    backgroundColor: colors.melon,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.faluRed,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  bottomPadding: {
    height: 20,
  },
});

export default Home;
