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
import colors from "../assets/colors/colors";

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

            <View style={styles.titleAndImageContainer}>
              <Text style={styles.title}>
                Welcome{"\n"}Wine{"\n"}Lover.
              </Text>
              <Image
                source={require("../assets/logos/Four_Glasses_Image.png")}
                style={styles.wineBottles}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
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
    backgroundColor: colors.seashell,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  titleAndImageContainer: {
    position: "relative",
    marginTop: 60,
    height: 390,
    padding: 16,
  },
  wineBottles: {
    width: "100%",
    height: 240,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
  },
  title: {
    fontSize: 75,
    fontWeight: "bold",
    fontFamily: "CelsiusFlower",
    textAlign: "left",
    lineHeight: 55,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    paddingTop: 20,
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
