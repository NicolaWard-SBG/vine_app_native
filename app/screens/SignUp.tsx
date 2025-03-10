import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../assets/colors/colors";

export default function SignUp() {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      // Optionally check if a user with this email already exists
      const existingUser = await db.getAllSync(
        "SELECT * FROM User WHERE email = ?",
        [email]
      );
      if (existingUser && existingUser.length > 0) {
        Alert.alert("Error", "A user with that email already exists.");
        return;
      }
      // Insert the new user
      await db.runAsync(
        "INSERT INTO User (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      );
      Alert.alert("Success", "User created successfully!");
      // Optionally, navigate to the Login screen or set auth state here
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Error", "Could not create user. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <Text style={styles.titleOne}>CREATE</Text>
      <Text style={styles.titleTwo}>YOUR ACCOUNT.</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.seashell },
  backButton: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "blue",
  },
  titleOne: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  titleTwo: {
    fontSize: 24,
    fontWeight: "bold",
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
  button: {
    backgroundColor: colors.melon,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
