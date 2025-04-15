import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import NetInfo from "@react-native-community/netinfo";
import { onAuthStateChanged } from "firebase/auth";

import { AuthContext } from "./app/contexts/AuthContext";
import { MainApp, AuthNavigator } from "./app/navigation/AppNavigator";
import { syncWines, fetchUserWines } from "./app/services/syncManager";
import { auth } from "./app/services/firebaseConfig";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
        setCurrentUser({
          id: user.uid,
          email: user.email,
        });

        try {
          // Fetch user's wines from Firebase
          await fetchUserWines();
          console.log("User wines fetched from Firebase");
        } catch (error) {
          console.error("Error fetching user wines:", error);
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Sync local data when device reconnects
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && isAuthenticated) {
        console.log("Device connected to the internet, syncing wines...");
        syncWines();
      }
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  if (!fontsLoaded || isLoading) {
    // Show a loading screen until fonts are ready and auth state is determined
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
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
