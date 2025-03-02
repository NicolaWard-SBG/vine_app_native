// Login.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../App";

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

export default function Login() {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      // Use a query to get the user record based on email and password.
      // Note: db.getAllSync is assumed to return an array of users.
      const users = await db.getAllSync<User>(
        "SELECT * FROM User WHERE email = ? AND password = ?",
        [email, password]
      );
      if (users && users.length > 0) {
        const loggedInUser = users[0]; // Type is now User
        Alert.alert("Success", "Logged in successfully!");
        setCurrentUser({ id: loggedInUser.id, email: loggedInUser.email });
        setIsAuthenticated(true);
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "Could not log in. Please try again.");
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
      <Text style={styles.titleOne}>WELCOME</Text>
      <Text style={styles.titleTwo}>WINE LOVER.</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FDF2F0",
    justifyContent: "center",
  },
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
    backgroundColor: "#000",
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
