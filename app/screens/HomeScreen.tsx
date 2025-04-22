import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../assets/colors/colors";
import { syncWines } from "../services/syncManager";
import { saveWineToStorage } from "../services/storage";
import { FormInput } from "../components/FormInput";
import { WineTypeModal } from "../components/WineTypeModal";
import { takePhoto, pickFromLibrary } from "../services/photoManager"; // ← new

export default function HomeScreen() {
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

    const uid = currentUser.id;
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
      userId: uid,
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

  const onTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setLabelImage(uri);
  };

  const onPickLibrary = async () => {
    const uri = await pickFromLibrary();
    if (uri) setLabelImage(uri);
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
            onChangeText={() => {}}
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

          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={onTakePhoto}>
              <Text style={styles.buttonText}>TAKE LABEL PHOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={onPickLibrary}
            >
              <Text style={styles.buttonText}>CHOOSE FROM LIBRARY</Text>
            </TouchableOpacity>
          </View>

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
  labelPreview: {
    width: 200,
    height: 150,
    alignSelf: "center",
    marginBottom: 12,
  },
  photoButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  cameraButton: {
    backgroundColor: colors.melon,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    paddingHorizontal: 8,
  },
  bottomPadding: { height: 20 },
});
