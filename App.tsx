import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import NetInfo from "@react-native-community/netinfo";

import { AuthContext } from "./app/contexts/AuthContext";
import { MainApp, AuthNavigator } from "./app/navigation/AppNavigator";
import { syncWines } from "./app/services/syncManager";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string | null;
  } | null>(null);

  // Load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Montserrat: require("./app/assets/fonts/Montserrat-VariableFont_wght.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }
    loadFonts();
  }, []);

  // Sync local data when device reconnects
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
    // Show a loading screen until fonts are ready
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
