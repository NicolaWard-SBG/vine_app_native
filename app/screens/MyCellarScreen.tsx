import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../assets/colors/colors";
import { Wine } from "../../types";
import { useWines } from "../hooks/useWines";
import { deleteWineFromStorage } from "../services/storage";
import {
  deleteWineFromFirebase,
  fetchUserWines,
} from "../services/syncManager";
import { WineItem } from "../components/WineItem";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";

type MyCellarNavProp = StackNavigationProp<AuthStackParamList, "MyCellar">;

const FILTER_TYPES = ["All", "Red", "White", "Rose", "Sparkling", "Fortified"];

function MyCellar() {
  const navigation = useNavigation<MyCellarNavProp>();
  const [filterType, setFilterType] = useState<string | null>(null);
  const { wines, refetch } = useWines(filterType);
  const { currentUser } = useContext(AuthContext);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
      // Return a cleanup function
      return () => {};
    }, [refetch])
  );

  const deleteWine = async (id: string) => {
    if (!currentUser?.id) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    // Find the wine to be deleted
    const wineToDelete = wines.find((wine) => wine.id === id);

    if (!wineToDelete) {
      Alert.alert("Error", "Wine not found.");
      return;
    }

    Alert.alert("Delete Wine", "Are you sure you want to delete this wine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Delete from local storage
            await deleteWineFromStorage(id);

            // If the wine has been synced to Firebase, delete it there too
            if (wineToDelete.synced) {
              await deleteWineFromFirebase(wineToDelete.id);
            }

            // Refresh the wines list after deletion
            refetch();
            Alert.alert("Success", "Wine deleted successfully.");
          } catch (error) {
            console.error("Error deleting wine:", error);
            Alert.alert("Error", "Could not delete wine. Please try again.");
          }
        },
      },
    ]);
  };

  // Pull-to-refresh functionality to FlatList
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // First fetch from Firebase to ensure we have latest data
    await fetchUserWines();
    // Then refresh local display
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderWineItem = ({ item }: { item: Wine }) => (
    <WineItem
      wine={item}
      onDelete={deleteWine}
      onEdit={(wine) => navigation.navigate("Home", { wine })}
    />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
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
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
});

export default MyCellar;
