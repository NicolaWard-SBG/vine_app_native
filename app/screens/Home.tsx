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
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

// Home component
export default function Home() {
  const db = useSQLiteContext(); // Get the SQLite database context

  // State for form inputs
  const [wineMaker, setWineMaker] = useState("");
  const [wineName, setWineName] = useState("");
  const [grape, setGrape] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");

  // Function to handle adding a new wine to the database
  const handleAddWine = async () => {
    // Check if the required fields are filled
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

    const validTypes = ["Red", "White", "Rose", "Sparkling", "Fortified"];
    if (!validTypes.includes(type)) {
      Alert.alert(
        "Error",
        "Invalid wine type. Please type Red, White, Rose, Sparkling or Fortified."
      );
      return;
    }

    try {
      // Insert the new wine into the database
      await db.runAsync(
        "INSERT INTO Wine (wineMaker, wineName, grape, type, year, rating, region) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [wineMaker, wineName, grape, type, year, rating, region]
      );

      // Show success message and reset form fields
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
      // Show error message if adding a wine fails
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
          placeholder="Type (Red, White, etc.)"
          value={type}
          onChangeText={setType}
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
      </View>
    </SafeAreaView>
  );
}

// Styles for the component
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
});
