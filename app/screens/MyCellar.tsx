// MyCellar.tsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Wine } from "../../types";
import { Swipeable } from "react-native-gesture-handler";
import { AuthContext } from "../../App"; // adjust the path if needed

function MyCellar() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const db = useSQLiteContext();
  const { currentUser } = useContext(AuthContext);

  // Function to fetch data from the database, filtering by the logged in user's id.
  const fetchData = useCallback(async () => {
    // Ensure we have a logged in user
    if (!currentUser || currentUser.id === undefined) {
      setWines([]);
      return;
    }

    try {
      let query: string;
      let params: (string | number)[];

      if (filterType) {
        query = "SELECT * FROM Wine WHERE type = ? AND userId = ?";
        params = [filterType, currentUser.id];
      } else {
        query = "SELECT * FROM Wine WHERE userId = ?";
        params = [currentUser.id];
      }

      const result = await db.getAllAsync<Wine[]>(query, params);

      console.log("Fetched result:", result);

      setWines(Array.isArray(result) ? result.flat() : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWines([]);
    }
  }, [db, filterType, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData, filterType]);

  // Function to delete a wine from the database
  const deleteWine = async (id: number) => {
    if (!currentUser || currentUser.id === undefined) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
    Alert.alert("Delete Wine", "Are you sure you want to delete this wine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Only delete the wine if it belongs to the current user
            await db.runAsync("DELETE FROM Wine WHERE id = ? AND userId = ?", [
              id,
              currentUser.id,
            ]);
            // Update state to remove the deleted wine
            setWines((prevWines) => prevWines.filter((wine) => wine.id !== id));
            Alert.alert("Success", "Wine deleted successfully.");
          } catch (error) {
            console.error("Error deleting wine:", error);
            Alert.alert("Error", "Could not delete wine. Please try again.");
          }
        },
      },
    ]);
  };

  // Render the right action for the swipeable component
  const renderRightActions = (id: number) => (
    <View
      style={[styles.deleteButtonContainer, { height: styles.wineItem.height }]}
    >
      <Button title="Delete" color="white" onPress={() => deleteWine(id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cellar</Text>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        {["All", "Red", "White", "Rose", "Sparkling", "Fortified"].map(
          (type) => (
            <Button
              key={type}
              title={type}
              onPress={() => setFilterType(type === "All" ? null : type)}
            />
          )
        )}
      </View>

      {/* Display message if no wines are found */}
      {wines.length === 0 ? (
        <Text style={styles.emptyMessage}>No wines found.</Text>
      ) : (
        <FlatList
          data={wines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.swipeableItemWrapper}>
              <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <View style={styles.wineItem}>
                  <View style={styles.wineInfo}>
                    <Text>{item.wineMaker}</Text>
                    <Text style={styles.wineName}>{item.wineName}</Text>
                    <Text>{item.grape}</Text>
                    <Text>{item.type}</Text>
                    <Text>{item.year}</Text>
                    <Text>{item.rating}</Text>
                    <Text>{item.region}</Text>
                    <Text>{item.notes}</Text>
                  </View>
                </View>
              </Swipeable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  swipeableItemWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  wineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    height: 170,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    backgroundColor: "maroon",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default MyCellar;
