import React, { useEffect, useContext } from "react";
import { View, Alert, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../assets/colors/colors";

import HomeScreen from "../screens/HomeScreen";
import MyCellarScreen from "../screens/MyCellarScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { AuthContext } from "../contexts/AuthContext";
import { Wine } from "../../types";

// ---------------------------------------------------
// 1. BOTTOM TAB NAVIGATOR (MainApp) for authenticated users
// ---------------------------------------------------
type MainTabParamList = {
  Home: undefined;
  MyCellar: undefined;
  Logout: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function LogoutScreen() {
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  useEffect(() => {
    // Prompt the user to confirm logout when tab is focused
    const unsubscribe = navigation.addListener("focus", () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => navigation.navigate("Home"),
          },
          {
            text: "Yes",
            onPress: () => {
              setCurrentUser(null);
              setIsAuthenticated(false);
            },
          },
        ],
        { cancelable: false }
      );
    });
    return unsubscribe;
  }, [navigation, setCurrentUser, setIsAuthenticated]);

  // Renders an empty screen while the Alert is active
  return <View style={{ flex: 1 }} />;
}

export function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.seashell,
          borderTopWidth: 0,
          height: 80,
        },
        tabBarActiveTintColor: colors.faluRed,
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCellar"
        component={MyCellarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bottle-wine" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="logout" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ---------------------------------------------------
// 2. STACK NAVIGATOR (AuthNavigator) for unauthenticated users
// ---------------------------------------------------
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: { wine?: Wine };
  MyCellar: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Home" component={HomeScreen} />
      <AuthStack.Screen name="MyCellar" component={MyCellarScreen} />
    </AuthStack.Navigator>
  );
}
