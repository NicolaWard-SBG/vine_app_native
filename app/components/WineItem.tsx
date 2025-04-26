import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import colors from "../assets/colors/colors";
import { Wine } from "../../types";

export interface WineItemProps {
  wine: Wine;
  onDelete: (id: string) => void;
  onEdit: (wine: Wine) => void;
}

export const WineItem: React.FC<WineItemProps> = ({
  wine,
  onDelete,
  onEdit,
}) => {
  const renderLeftActions = () => (
    <View style={styles.editButtonContainer}>
      <Button title="Edit" color="white" onPress={() => onEdit(wine)} />
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.deleteButtonContainer}>
      <Button title="Delete" color="white" onPress={() => onDelete(wine.id)} />
    </View>
  );

  return (
    <View style={styles.swipeableItemWrapper}>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
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

const styles = StyleSheet.create({
  swipeableItemWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  wineItem: {
    flexDirection: "row",
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
  editButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    backgroundColor: colors.melon,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
