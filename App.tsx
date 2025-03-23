import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Text, View, Alert } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./app/screens/Home";
import MyCellar from "./app/screens/MyCellar";
import SignUp from "./app/screens/SignUp";
import Login from "./app/screens/SignIn";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Font from "expo-font";
import { AuthContext } from "./AppContext";
import NetInfo from "@react-native-community/netinfo";
import { syncWines } from "./syncManager";

type TabParamList = {
  Home: undefined;
  MyCellar: undefined;
  Logout: undefined;
};
// Load fonts
const fetchFonts = () => {
  return Font.loadAsync({
    Montserrat: require("./app/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });
};

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

function LogoutScreen() {
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<TabParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      Alert.alert(
        "Log Out",
        "Are you sure you would like to log out?",
        [
          {
            text: "No",
            onPress: () => {
              // Navigate back to Home if the user cancels
              navigation.navigate("Home");
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              // Clear the authentication state
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

  // Optionally, display a placeholder while the alert is active
  return <View style={{ flex: 1 }} />;
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#FEF6F3", borderTopWidth: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCellar"
        component={MyCellar}
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

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Home" component={Home} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="MyCellar" component={MyCellar} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    fetchFonts()
      .then(() => setFontsLoaded(true))
      .catch((e) => console.error("Error loading fonts:", e));
  }, []);

  // Listen for connectivity changes and trigger syncing when online
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log("Device connected to the internet, syncing wines...");
        syncWines();
      }
    });
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            isAuthenticated,
            currentUser,
            setIsAuthenticated,
            setCurrentUser,
          }}
        >
          {isAuthenticated ? <MainApp /> : <AuthNavigator />}
        </AuthContext.Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
