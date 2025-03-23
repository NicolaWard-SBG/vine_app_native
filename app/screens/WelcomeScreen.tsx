// app/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import colors from "../assets/colors/colors";

type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Welcome"
>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleSignInPress = () => {
    navigation.navigate("SignIn");
  };

  const handleGetStartedPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logos/VineBottleLogo_Black.gif")}
        style={styles.bottleImage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignInPress}
        >
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStartedPress}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.seashell,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  bottleImage: {
    width: 300,
    height: 300,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  getStartedButton: {
    backgroundColor: colors.melon,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
