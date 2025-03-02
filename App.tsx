import React, { useState, createContext, useContext, useEffect } from "react";
import { ActivityIndicator, Text, View, Alert } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./app/screens/Home";
import MyCellar from "./app/screens/MyCellar";
import SignUp from "./app/screens/SignUp";
import Login from "./app/screens/SignIn";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";

// Load Montserrat font
const fetchFonts = () => {
  return Font.loadAsync({
    // Map the font family name to your font file (adjust the file name and path as needed)
    Montserrat: require("./app/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });
};

// Create tab and stack navigators
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Create an AuthContext with full type information
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  currentUser: { id: number; email: string } | null;
  setIsAuthenticated: (value: boolean) => void;
  setCurrentUser: (user: { id: number; email: string } | null) => void;
}>({
  isAuthenticated: false,
  currentUser: null,
  setIsAuthenticated: () => {},
  setCurrentUser: () => {},
});

const loadDatabase = async () => {
  const dbName = "vine_DB.db";
  const dbAsset = require("./app/assets/vine_DB.db");
};

// Component to initialize or update the DB schema
function DBInitializer() {
  const db = useSQLiteContext();

  useEffect(() => {
    const initializeDBSchema = async () => {
      try {
        const schema = await db.getAllAsync("PRAGMA table_info(Wine)", []);
        console.log("Updated Wine table schema:", schema);
      } catch (error) {
        console.log("Error updating Wine schema:", error);
      }
    };
    initializeDBSchema();
  }, [db]);

  return null;
}

function LogoutScreen() {
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigation = useNavigation<any>();

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

  // Return an empty view since the alert handles the interaction.
  return <View />;
}

function MainApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
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
      screenOptions={{ headerShown: false }} // hides header on all screens in this navigator
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="Home" component={Home} />
      <AuthStack.Screen name="MyCellar" component={MyCellar} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Load fonts
    fetchFonts()
      .then(() => setFontsLoaded(true))
      .catch((e) => console.error("Error loading fonts:", e));
  }, []);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error("Error loading DB:", e));
  }, []);

  if (!dbLoaded || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading Database and Fonts...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <StatusBar hidden={true} /> */}
      <NavigationContainer>
        <SQLiteProvider databaseName="vine_DB.db" useSuspense>
          <DBInitializer />
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
        </SQLiteProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
