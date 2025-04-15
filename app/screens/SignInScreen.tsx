import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../contexts/AuthContext";
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/logos/VineBottles.png")}
                style={styles.wineBottles}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.titleOne}>WELCOME</Text>
              <Text style={styles.titleTwo}>WINE LOVER.</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F0",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  backButton: {
    marginVertical: 16,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  wineBottles: {
    width: "100%",
    height: 240,
  },
  formContainer: {
    flex: 1,
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
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
