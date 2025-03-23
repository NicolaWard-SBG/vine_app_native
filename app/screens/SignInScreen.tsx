import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../contexts/AuthContext"; // or where you export it
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const navigation = useNavigation();
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      Alert.alert("Success", "Logged in successfully!");
      setCurrentUser({ id: loggedInUser.uid, email: loggedInUser.email });
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Error logging in:", error);
      Alert.alert("Error", error.message || "Invalid email or password.");
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
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
