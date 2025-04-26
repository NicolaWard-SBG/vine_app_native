import React, { useState, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
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
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AppNavigator";

type MyCellarNavProp = StackNavigationProp<AuthStackParamList, "MyCellar">;

const FILTER_TYPES = [
  "All",
  "Red",
  "White",
  "Rose",
  "Orange",
  "Sparkling",
  "Fortified",
];

function MyCellar() {
  const navigation = useNavigation<MyCellarNavProp>();
  const route = useRoute();
  const [filterType, setFilterType] = useState<string | null>(null);
  const { wines, refetch } = useWines(filterType);
  const { currentUser } = useContext(AuthContext);

  const swipeableRefs = useRef<Map<string, any>>(new Map());

  useFocusEffect(
    useCallback(() => {
      refetch();
      const routeParams = route.params as
        | { disableSwipe?: boolean }
        | undefined;
      if (routeParams?.disableSwipe) {
        closeAllSwipeables();
      }
      return () => {};
    }, [refetch, route.params])
  );

  const closeAllSwipeables = () => {
    swipeableRefs.current.forEach((ref) => {
      if (ref && ref.close) {
        ref.close();
      }
    });
  };

  const saveSwipeableRef = (id: string, ref: any) => {
    if (ref) {
      swipeableRefs.current.set(id, ref);
    }
  };

  const deleteWine = async (id: string) => {
    if (!currentUser?.id) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
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
            await deleteWineFromStorage(id);
            if (wineToDelete.synced) {
              await deleteWineFromFirebase(wineToDelete.id);
            }
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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserWines();
    await refetch();
    closeAllSwipeables();
    setRefreshing(false);
  }, [refetch]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {FILTER_TYPES.map((type) => {
              const isSelected = (filterType || "All") === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    setFilterType(type === "All" ? null : type);
                    closeAllSwipeables();
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
            onScrollBeginDrag={closeAllSwipeables}
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
    marginBottom: 16,
  },
  chipScroll: {
    paddingHorizontal: 2,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 6,
  },
  chipSelected: {
    backgroundColor: colors.faluRed,
  },
  chipText: {
    fontSize: 14,
    color: colors.faluRed,
  },
  chipTextSelected: {
    color: "#fff",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
});

export default MyCellar;
