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
import * as Font from "expo-font";

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

// Modified to use the asset functionality of SQLiteProvider
const loadDatabase = async () => {
  // This function is now essentially a placeholder since the SQLiteProvider handles loading the asset
  return Promise.resolve();
};

// Component to initialize or update the DB schema
function DBInitializer() {
  const db = useSQLiteContext();

  useEffect(() => {
    const initializeDBSchema = async () => {
      try {
        console.log("Starting DB schema initialization...");

        // First, check if the Wine table exists and has the correct structure
        const wineTableExists = await db.getAllAsync(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Wine'",
          []
        );

        if (wineTableExists.length === 0) {
          console.log("Wine table does not exist. Creating table...");
          await db.runAsync(
            `CREATE TABLE IF NOT EXISTS Wine (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              wineMaker TEXT NOT NULL,
              wineName TEXT NOT NULL,
              grape TEXT NOT NULL,
              type TEXT NOT NULL CHECK (type IN ('Red', 'White', 'Rose', 'Sparkling', 'Dessert', 'Fortified')),
              year INTEGER,
              rating REAL,
              region TEXT,
              notes TEXT,
              labelImage BLOB,
              userId INTEGER
            )`
          );
          console.log("Wine table created successfully.");
        } else {
          // Check that the Wine table has the correct columns
          const wineSchema = await db.getAllAsync(
            "PRAGMA table_info(Wine)",
            []
          );
          console.log("Current Wine table schema:", wineSchema);

          // Get the column names from the schema
          const columnNames = wineSchema.map((col: any) => col.name);

          // Check if the required columns exist
          const requiredColumns = [
            "wineMaker",
            "wineName",
            "grape",
            "type",
            "year",
            "rating",
            "region",
            "notes",
            "labelImage",
            "userId",
          ];

          const missingColumns = requiredColumns.filter(
            (colName) => !columnNames.includes(colName)
          );

          if (missingColumns.length > 0) {
            console.log("Missing columns detected:", missingColumns);

            // If columns are missing, it might be better to recreate the table
            // But first check if there's data we should preserve
            const rowCount = await db.getFirstAsync(
              "SELECT COUNT(*) as count FROM Wine",
              []
            );

            if (rowCount && (rowCount as { count: number }).count > 0) {
              console.log(
                `Found ${
                  (rowCount as { count: number }).count
                } existing wines. Adding missing columns...`
              );

              // Add missing columns one by one
              for (const colName of missingColumns) {
                let colDef;
                switch (colName) {
                  case "wineMaker":
                  case "wineName":
                  case "grape":
                    colDef = "TEXT NOT NULL DEFAULT ''";
                    break;
                  case "type":
                    colDef = "TEXT NOT NULL DEFAULT 'Red'";
                    break;
                  case "year":
                  case "userId":
                    colDef = "INTEGER";
                    break;
                  case "rating":
                    colDef = "REAL";
                    break;
                  case "region":
                  case "notes":
                    colDef = "TEXT";
                    break;
                  case "labelImage":
                    colDef = "BLOB";
                    break;
                  default:
                    colDef = "TEXT";
                }

                try {
                  await db.runAsync(
                    `ALTER TABLE Wine ADD COLUMN ${colName} ${colDef}`
                  );
                  console.log(`Added column ${colName} to Wine table.`);
                } catch (error) {
                  console.error(`Error adding column ${colName}:`, error);
                }
              }
            } else {
              console.log(
                "No existing wine data. Recreating the Wine table..."
              );

              // Drop and recreate the table if there's no data to preserve
              await db.runAsync("DROP TABLE IF EXISTS Wine");
              await db.runAsync(
                `CREATE TABLE IF NOT EXISTS Wine (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  wineMaker TEXT NOT NULL,
                  wineName TEXT NOT NULL,
                  grape TEXT NOT NULL,
                  type TEXT NOT NULL CHECK (type IN ('Red', 'White', 'Rose', 'Sparkling', 'Dessert', 'Fortified')),
                  year INTEGER,
                  rating REAL,
                  region TEXT,
                  notes TEXT,
                  labelImage BLOB,
                  userId INTEGER
                )`
              );
              console.log("Wine table recreated successfully.");
            }
          } else {
            console.log("Wine table schema is correct.");
          }
        }

        // Create the User table if it doesn't exist
        await db.runAsync(
          "CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)"
        );
        console.log("User table created or already exists.");

        console.log("DB schema initialization completed successfully.");
      } catch (error) {
        console.error("Error initializing DB schema:", error);
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FEF6F3",
          borderTopWidth: 0,
        },
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
      screenOptions={{ headerShown: false }} // hides header on all screens in this navigator
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
