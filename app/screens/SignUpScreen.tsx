import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../assets/colors/colors";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUp() {
  const navigation = useNavigation();
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Optionally update the user's display name
      await updateProfile(userCredential.user, { displayName: username });
      setCurrentUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
      setIsAuthenticated(true);
      Alert.alert("Success", "User created successfully!");
    } catch (error: any) {
      console.error("Error signing up:", error);
      Alert.alert(
        "Error",
        error.message || "Could not create user. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          Create{"\n"}Your{"\n"}Account.
        </Text>
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
    padding: 16,
    paddingTop: Platform.OS === "android" ? 20 : 0, // Add padding top for Android
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "blue",
  },
  title: {
    fontSize: 75,
    fontFamily: "CelsiusFlower",
    textAlign: "left",
    lineHeight: 55, // Keeping the original compact line height
    paddingTop: 20, // Adding padding to prevent text cutoff at top
    marginTop: 60,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    zIndex: 2,
  },
  button: {
    backgroundColor: colors.faluRed,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
