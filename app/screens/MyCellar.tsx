import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Wine } from "../../types";
import { Swipeable } from "react-native-gesture-handler";
import { AuthContext } from "../../App";
import colors from "../assets/colors/colors";

const FILTER_TYPES = ["All", "Red", "White", "Rose", "Sparkling", "Fortified"];

interface WineItemProps {
  wine: Wine;
  onDelete: (id: number) => void;
}

const WineItem = ({ wine, onDelete }: WineItemProps) => {
  const renderRightActions = () => (
    <View
      style={[styles.deleteButtonContainer, { height: styles.wineItem.height }]}
    >
      <Button title="Delete" color="white" onPress={() => onDelete(wine.id)} />
    </View>
  );

  return (
    <View style={styles.swipeableItemWrapper}>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.wineItem}>
          {wine.labelImage && (
            <Image
              source={{ uri: wine.labelImage }}
              style={styles.wineLabelImage}
            />
          )}
          <View style={styles.wineInfo}>
            <Text>{wine.wineMaker}</Text>
            <Text style={styles.wineName}>{wine.wineName}</Text>
            <Text>{wine.grape}</Text>
            <Text>{wine.type}</Text>
            <Text>{wine.year}</Text>
            <Text>{wine.rating}</Text>
            <Text>{wine.region}</Text>
            <Text>{wine.notes}</Text>
          </View>
        </View>
      </Swipeable>
    </View>
  );
};

function MyCellar() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const db = useSQLiteContext();
  const { currentUser } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    if (!currentUser?.id) {
      setWines([]);
      return;
    }

    try {
      const query = filterType
        ? "SELECT * FROM Wine WHERE type = ? AND userId = ?"
        : "SELECT * FROM Wine WHERE userId = ?";
      const params = filterType
        ? [filterType, currentUser.id]
        : [currentUser.id];

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
  }, [fetchData]);

  const deleteWine = async (id: number) => {
    if (!currentUser?.id) {
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
            await db.runAsync("DELETE FROM Wine WHERE id = ? AND userId = ?", [
              id,
              currentUser.id,
            ]);
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

  const renderWineItem = ({ item }: { item: Wine }) => (
    <WineItem wine={item} onDelete={deleteWine} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Render filter buttons */}
        <View style={styles.filterContainer}>
          {FILTER_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => setFilterType(type === "All" ? null : type)}
            />
          ))}
        </View>

        {wines.length === 0 ? (
          <Text style={styles.emptyMessage}>No wines found.</Text>
        ) : (
          <FlatList
            data={wines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderWineItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.seashell,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.seashell,
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
    justifyContent: "flex-start",
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
  wineLabelImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
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
    backgroundColor: colors.faluRed,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default MyCellar;
