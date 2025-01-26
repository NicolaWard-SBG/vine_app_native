import React from "react";
import { StyleSheet, Platform, View, Text } from "react-native";

function MyCellar() {
  return (
    <View style={styles.container}>
      <Text>My Cellar</Text>
    </View>
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

export default MyCellar;
