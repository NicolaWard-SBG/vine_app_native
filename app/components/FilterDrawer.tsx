import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import colors from "../assets/colors/colors";
import { Ionicons } from "@expo/vector-icons";

export interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  filterTypes: { key: string; label: string; selected: boolean }[];
  onToggleType: (key: string) => void;
  allFoodTags: { key: string; label: string; selected: boolean }[];
  allAttributeTags: { key: string; label: string; selected: boolean }[];
  onToggleTag: (key: string) => void;
  showFavouritesOnly: boolean; // Add this prop
  onToggleFavourites: () => void; // Add this prop
  onClear: () => void;
  onApply: () => void;
}

export default function FilterDrawer({
  visible,
  onClose,
  filterTypes,
  onToggleType,
  allFoodTags,
  allAttributeTags,
  onToggleTag,
  showFavouritesOnly,
  onToggleFavourites,
  onClear,
  onApply,
}: FilterDrawerProps) {
  const screenWidth = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <SafeAreaView style={styles.drawerContent}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#8b0000" />
          </TouchableOpacity>

          {/* Favourites Section */}
          <Text style={styles.sectionTitle}>Favourites</Text>
          <TouchableOpacity
            style={[styles.chip, showFavouritesOnly && styles.chipSelected]}
            onPress={onToggleFavourites}
            testID="favourites-chip"
          >
            <Text
              style={
                showFavouritesOnly ? styles.chipTextSelected : styles.chipText
              }
              testID="favourites-chip-text"
            >
              Show Favourites Only
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />

          {/* Wine Type Section */}
          <Text style={styles.sectionTitle} testID="wine-type-section-title">
            Wine Type
          </Text>
          <View style={styles.chipContainer}>
            {filterTypes.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, f.selected && styles.chipSelected]}
                onPress={() => onToggleType(f.key)}
                testID="food-pairing-section-title"
              >
                <Text
                  style={f.selected ? styles.chipTextSelected : styles.chipText}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.separator} />

          {/* Food Pairing Section */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
            Food Pairing
          </Text>
          <View style={styles.chipContainer}>
            {allFoodTags.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, t.selected && styles.chipSelected]}
                onPress={() => onToggleTag(t.key)}
              >
                <Text
                  style={t.selected ? styles.chipTextSelected : styles.chipText}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.separator} />

          {/* Attribute Tags */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
            Wine Attributes
          </Text>
          <View style={styles.chipContainer}>
            {allAttributeTags.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, t.selected && styles.chipSelected]}
                onPress={() => onToggleTag(t.key)}
              >
                <Text
                  style={t.selected ? styles.chipTextSelected : styles.chipText}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.separator} />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClear} testID="clear-filters-btn">
              <Text style={styles.clearText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.seashell,
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get("window").width,
    backgroundColor: colors.seashell,
    padding: 16,
    zIndex: 2,
    elevation: 5,
  },
  drawerContent: { flex: 1 },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "CelsiusFlower",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#8b0000",
    borderColor: "#8b0000",
  },
  chipText: { color: "#333" },
  chipTextSelected: { color: "#fff" },
  favouriteChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.oxfordBlue,
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  clearText: {
    fontSize: 16,
    color: colors.white,
    backgroundColor: colors.melon,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyBtn: {
    backgroundColor: colors.faluRed,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
