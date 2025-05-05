import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
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
  onToggleTag: (key: string) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function FilterDrawer({
  visible,
  onClose,
  filterTypes,
  onToggleType,
  allFoodTags,
  onToggleTag,
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

          {/* Wine Type Section */}
          <Text style={styles.sectionTitle}>Wine Type</Text>
          <View style={styles.chipContainer}>
            {filterTypes.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, f.selected && styles.chipSelected]}
                onPress={() => onToggleType(f.key)}
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

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClear}>
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
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
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
  clearText: { fontSize: 16, color: "#8b0000" },
  applyBtn: {
    backgroundColor: "#8b0000",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
