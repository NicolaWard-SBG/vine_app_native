import React from "react";
import MyCellar from "./app/screens/MyCellar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Platform, View, Text } from "react-native";
import Login from "./app/screens/Login";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Vine App</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name={"Login"}
          component={Login}
          options={{ title: "Login" }}
        />
        <Tab.Screen name="My Cellar" component={MyCellar} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 20 : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
  },
});
