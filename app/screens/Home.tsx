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
import { AuthContext } from "../../AppContext";
import colors from "../assets/colors/colors";
import * as ImagePicker from "expo-image-picker";
import NetInfo from "@react-native-community/netinfo";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  saveWineToStorage,
  getWinesFromStorage,
  updateWinesInStorage,
} from "../../storage";

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
  const { currentUser } = useContext(AuthContext);

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

  const syncWines = async () => {
    const wines = await getWinesFromStorage();
    const unsynced = wines.filter((w: any) => !w.synced);

    for (const wine of unsynced) {
      try {
        await addDoc(collection(db, "wines"), wine);
        wine.synced = true;
      } catch (e: any) {
        console.log("Sync failed for wine:", wine.wineName, e.message, e);
      }
    }

    await updateWinesInStorage(wines);
  };
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

  const handleTakePicture = async () => {
    try {
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

      if (!result.canceled && result.assets?.length > 0) {
        setLabelImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Camera Error", "There was a problem accessing the camera.");
    }
  };

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

  const handleAddWine = async () => {
    if (!currentUser) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    const wine = {
      wineMaker,
      wineName,
      grape,
      type,
      year: parseInt(year),
      rating: parseFloat(rating),
      region,
      notes,
      labelImage,
      userId: currentUser.id,
      synced: false,
      timestamp: new Date().toISOString(),
    };

    await saveWineToStorage(wine);

    const state = await NetInfo.fetch();
    if (state.isConnected) {
      await syncWines();
    }

    Alert.alert("Success", "Wine saved!");
    resetForm();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
  safeArea: { flex: 1, backgroundColor: colors.seashell },
  container: { flex: 1, backgroundColor: colors.seashell },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "500",
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
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.faluRed,
    paddingVertical: 12,
    alignItems: "center",
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
