import React, { useState, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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
import FilterDrawer, { FilterDrawerProps } from "../components/FilterDrawer";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

type MyCellarNavProp = StackNavigationProp<AuthStackParamList, "MyCellar">;
// your static type list
const TYPE_OPTIONS = [
  "All",
  "Red",
  "White",
  "Rose",
  "Orange",
  "Sparkling",
  "Fortified",
];

export default function MyCellar() {
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation<MyCellarNavProp>();
  const route = useRoute();

  // UI state
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
  const [selectedAttributeTags, setSelectedAttributeTags] = useState<string[]>(
    []
  );

  // data
  const { wines, refetch } = useWines(filterType, selectedFoodTags);

  // swipe & refresh helpers
  const swipeableRefs = useRef<Map<string, any>>(new Map());
  const closeAllSwipeables = () =>
    swipeableRefs.current.forEach((r) => r?.close?.());
  const saveSwipeableRef = (id: string, ref: any) => {
    if (ref) swipeableRefs.current.set(id, ref);
  };

  const onRefresh = useCallback(async () => {
    await fetchUserWines();
    await refetch();
    closeAllSwipeables();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      const params = (route.params as { disableSwipe?: boolean }) || {};
      if (params.disableSwipe) closeAllSwipeables();
    }, [refetch, route.params])
  );

  // collect all tags
  const allFoodTags = Array.from(
    new Set(wines.flatMap((w) => w.foodPairings || []))
  );

  const allAttributeTags = Array.from(
    new Set(wines.flatMap((w) => w.attributeTags || []))
  );

  // delete handler unchanged
  const deleteWine = async (id: string) => {
    if (!currentUser?.id) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
    const wineToDelete = wines.find((w) => w.id === id);
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
            await deleteWineFromStorage(id);
            if (wineToDelete.synced) {
              await deleteWineFromFirebase(wineToDelete.id);
            }
            await refetch();
            Alert.alert("Success", "Wine deleted successfully.");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not delete wine. Please try again.");
          }
        },
      },
    ]);
  };

  const renderWineItem = ({ item }: { item: Wine }) => (
    <WineItem
      wine={item}
      onDelete={deleteWine}
      onEdit={(wine) => {
        closeAllSwipeables();
        navigation.navigate("Home", { wine });
      }}
      swipeableRef={(ref) => saveSwipeableRef(item.id, ref)}
    />
  );

  // build the object‐arrays for the drawer
  const drawerFilterTypes: FilterDrawerProps["filterTypes"] = TYPE_OPTIONS.map(
    (type) => ({
      key: type,
      label: type,
      // "All" means no filter, so selected when filterType===null
      selected: type === "All" ? filterType === null : filterType === type,
    })
  );

  const drawerFoodTags: FilterDrawerProps["allFoodTags"] = allFoodTags.map(
    (tag) => ({
      key: tag,
      label: tag,
      selected: selectedFoodTags.includes(tag),
    })
  );

  const drawerAttributeTags: FilterDrawerProps["allAttributeTags"] =
    allAttributeTags.map((tag) => ({
      key: tag,
      label: tag,
      selected: selectedAttributeTags.includes(tag),
    }));

  // Handle tag toggling based on which section it belongs to
  const handleToggleTag = (key: string) => {
    // Check if it's a food tag
    if (allFoodTags.includes(key)) {
      setSelectedFoodTags((prev) =>
        prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
      );
    }
    // Otherwise it's an attribute tag
    else if (allAttributeTags.includes(key)) {
      setSelectedAttributeTags((prev) =>
        prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
      );
    }
    closeAllSwipeables();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={20} color="#fff" />
            <Text style={styles.filterButtonText}> Filter</Text>
          </TouchableOpacity>
        </View>

        {wines.length === 0 ? (
          <Text style={styles.emptyMessage}>No wines found.</Text>
        ) : (
          <FlatList
            data={wines}
            keyExtractor={(item) => item.id}
            renderItem={renderWineItem}
            refreshing={false}
            onRefresh={onRefresh}
            onScrollBeginDrag={closeAllSwipeables}
            contentContainerStyle={styles.listContentContainer}
          />
        )}

        <FilterDrawer
          visible={filterVisible}
          onClose={() => {
            setFilterVisible(false);
            closeAllSwipeables();
            refetch();
          }}
          filterTypes={drawerFilterTypes}
          onToggleType={(key) => {
            setFilterType((prev) => (prev === key ? null : key));
            closeAllSwipeables();
          }}
          allFoodTags={drawerFoodTags}
          allAttributeTags={drawerAttributeTags}
          onToggleTag={handleToggleTag}
          onClear={() => {
            setFilterType(null);
            setSelectedFoodTags([]);
            setSelectedAttributeTags([]);
            closeAllSwipeables();
            refetch();
          }}
          onApply={() => {
            setFilterVisible(false);
            closeAllSwipeables();
            refetch();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.seashell },
  container: { flex: 1, backgroundColor: colors.seashell },
  filterButtonContainer: {
    padding: 12,
    alignItems: "flex-end",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.faluRed,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "600",
  },
  emptyMessage: { textAlign: "center", marginTop: 20, color: "#777" },
  listContentContainer: {
    padding: 10,
  },
});
