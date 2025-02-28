import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";

export default function Home() {
  const db = useSQLiteContext();

  // State for form inputs
  const [wineMaker, setWineMaker] = useState("");
  const [wineName, setWineName] = useState("");
  const [grape, setGrape] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");

  // State to control visibility of the modal
  const [showTypePicker, setShowTypePicker] = useState(false);

  const handleAddWine = async () => {
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
        "INSERT INTO Wine (wineMaker, wineName, grape, type, year, rating, region) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [wineMaker, wineName, grape, type, year, rating, region]
      );

      Alert.alert("Success", "Wine added to your cellar!");
      setWineMaker("");
      setWineName("");
      setGrape("");
      setType("");
      setYear("");
      setRating("");
      setRegion("");
      setNotes("");
    } catch (error) {
      console.error("Error adding wine:", error);
      Alert.alert("Error", "Could not add wine. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logos/VineBottleLogo_Black.gif")}
          style={styles.logo}
        />

        <Text style={styles.title}>Add a New Wine</Text>

        <TextInput
          style={styles.input}
          placeholder="Wine Maker"
          value={wineMaker}
          onChangeText={setWineMaker}
        />
        <TextInput
          style={styles.input}
          placeholder="Wine Name"
          value={wineName}
          onChangeText={setWineName}
        />
        <TextInput
          style={styles.input}
          placeholder="Grape Variety"
          value={grape}
          onChangeText={setGrape}
        />

        <TextInput
          style={styles.input}
          placeholder="Wine Type (Tap to select)"
          value={type}
          // We don't want the keyboard to show, so disable editing:
          editable={false}
          // When the user taps, show the picker modal:
          onPressIn={() => setShowTypePicker(true)}
        />

        <TextInput
          style={styles.input}
          placeholder="Year"
          value={year}
          keyboardType="numeric"
          onChangeText={setYear}
        />
        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          value={rating}
          keyboardType="numeric"
          onChangeText={setRating}
        />
        <TextInput
          style={styles.input}
          placeholder="Region"
          value={region}
          onChangeText={setRegion}
        />
        <TextInput
          style={styles.input}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
        />

        <Button title="Add Wine" onPress={handleAddWine} />

        {/* Modal that appears when selecting the wine 'Type' */}
        <Modal
          visible={showTypePicker}
          transparent={true}
          animationType="slide"
        >
          {/* TouchableOpacity to close the modal when tapping outside */}
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setShowTypePicker(false)}
          >
            {/* Stop propagation so tapping inside doesn't close immediately */}
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Select Wine Type</Text>

              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
              >
                <Picker.Item label="Select a type" value="" />
                <Picker.Item label="Red" value="Red" />
                <Picker.Item label="White" value="White" />
                <Picker.Item label="Rose" value="Rose" />
                <Picker.Item label="Sparkling" value="Sparkling" />
                <Picker.Item label="Fortified" value="Fortified" />
              </Picker>

              <Button title="Done" onPress={() => setShowTypePicker(false)} />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 75,
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent backdrop
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
});
