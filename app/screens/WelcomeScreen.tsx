import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import colors from "../assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={[colors.seashell, colors.melon]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 2 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/logos/Vine_App_Logo.png")}
        style={styles.vineLogo}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.seashell,
    alignItems: "center",
    justifyContent: "center",
  },
  vineLogo: {
    marginTop: 40,
    width: "100%",
    resizeMode: "contain",
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
    borderRadius: 16,
  },
  getStartedButton: {
    backgroundColor: colors.faluRed,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    borderRadius: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
