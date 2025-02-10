import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Wine } from "../../types";
import { Swipeable } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// MyCellar component
function MyCellar() {
  const [wines, setWines] = useState<Wine[]>([]); // State to store the list of wines
  const [filterType, setFilterType] = useState<string | null>(null); // State to store the selected filter type
  const db = useSQLiteContext(); // Get the SQLite database context

  // Function to fetch data from the database
  const fetchData = useCallback(async () => {
    try {
      // Query to fetch wines based on the selected filter type
      const query = filterType
        ? `SELECT * FROM Wine WHERE type = ?`
        : `SELECT * FROM Wine`;
      const params = filterType ? [filterType] : [];

      // Get the result
      const result = await db.getAllAsync<Wine[]>(query, params);

      console.log("Fetched result:", result);

      // Update the wines state with the fetched data (had to use flat() because of the way the data is returned)
      setWines(Array.isArray(result) ? result.flat() : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWines([]); // Set wines to an empty array if there's an error
    }
  }, [db, filterType]);

  // added a useEffect to fetch data when the component mounts or when filterType changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to delete a wine from the database
  const deleteWine = async (id: number) => {
    Alert.alert("Delete Wine", "Are you sure you want to delete this wine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Execute the delete query
            await db.runAsync("DELETE FROM Wine WHERE id = ?", [id]);
            // Update the wines state to remove the deleted wine
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
        // Display the list of wines
        <FlatList
          data={wines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
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
          )}
        />
      )}
    </View>
  );
}

// Styles for the component
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
  wineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
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
    height: "100%",
    backgroundColor: "maroon",
    borderRadius: 16,
  },
});

export default MyCellar;
