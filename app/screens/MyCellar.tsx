import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Wine } from "../../types";

function MyCellar() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const db = useSQLiteContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const query = filterType
          ? `SELECT * FROM Wine WHERE type = ?`
          : `SELECT * FROM Wine`;
        const params = filterType ? [filterType] : [];
        const result = await db.getAllAsync<Wine[]>(query, params);
        console.log(result);
        setWines(result.flat()); // Flatten the result array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [db, filterType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cellar</Text>
      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => setFilterType(null)} />
        <Button title="Red" onPress={() => setFilterType("Red")} />
        <Button title="White" onPress={() => setFilterType("White")} />
        <Button title="Rose" onPress={() => setFilterType("Rose")} />
        <Button title="Sparkling" onPress={() => setFilterType("Sparkling")} />
        <Button title="Fortified" onPress={() => setFilterType("Fortified")} />
      </View>
      <FlatList
        data={wines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.wineItem}>
            <Text style={styles.wineName}>{item.wineName}</Text>
            <Text>Grape: {item.grape}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Year: {item.year}</Text>
            <Text>Rating: {item.rating}</Text>
            <Text>Region: {item.region}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  wineItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  wineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MyCellar;
