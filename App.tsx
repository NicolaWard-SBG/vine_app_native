import * as React from "react";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./app/screens/Home";
import MyCellar from "./app/screens/MyCellar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

// Helper function to load the database, I could move this to a separate file?
const loadDatabase = async () => {
  const dbName = "vine_DB.db";
  const dbAsset = require("./app/assets/vine_DB.db"); // Database asset
  const dbUri = Asset.fromModule(dbAsset).uri; // URI of the database asset
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`; // File path to store the database

  // Check if the database file already exists
  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    // Create the directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    // Download the database file
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false); // State to track if the database is loaded

  // Load the database when the component mounts
  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true)) // Set the state to true when the database is loaded
      .catch((e) => console.error(e)); // Log any errors
  }, []);

  // Show a loading wheel if the database is not loaded
  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading Database...</Text>
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <React.Suspense
          fallback={
            <View style={{ flex: 1 }}>
              <ActivityIndicator size={"large"} />
              <Text>Loading Database...</Text>
            </View>
          }
        >
          <SQLiteProvider databaseName="vine_DB.db" useSuspense>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName: string = "";

                  // Set the icon name based on the route name
                  if (route.name === "Home") {
                    iconName = "home";
                  } else if (route.name === "MyCellar") {
                    iconName = "bottle-wine";
                  }

                  return <Icon name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="MyCellar" component={MyCellar} />
            </Tab.Navigator>
          </SQLiteProvider>
        </React.Suspense>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
