import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import colors from "../assets/colors/colors";
import { Wine } from "../../types";

export interface WineItemProps {
  wine: Wine;
  onDelete: (id: string) => void;
  onEdit: (wine: Wine) => void;
  swipeableRef?: (ref: any) => void; // Add this prop
}

export const WineItem: React.FC<WineItemProps> = ({
  wine,
  onDelete,
  onEdit,
  swipeableRef, // Receive the ref function
}) => {
  const [imageLoading, setImageLoading] = useState(false);

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
        ref={swipeableRef} // Assign the ref
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <View style={styles.wineItem}>
          {wine.labelImage ? (
            <View style={styles.imageContainer}>
              {imageLoading && (
                <ActivityIndicator
                  style={styles.loadingIndicator}
                  color={colors.faluRed}
                  size="small"
                />
              )}
              <Image
                source={{ uri: wine.labelImage }}
                style={styles.wineLabelImage}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={[styles.wineLabelImage, styles.noImage]}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}
          <View style={styles.wineInfo}>
            <Text>{wine.wineMaker}</Text>
            <Text style={styles.wineName}>{wine.wineName}</Text>
            <Text>{wine.grape}</Text>
            <Text>{wine.type}</Text>
            <Text>{wine.year}</Text>
            <Text>{wine.rating}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {wine.region}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {wine.notes}
            </Text>
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
  imageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginRight: 10,
  },
  wineLabelImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  loadingIndicator: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 1,
  },
  noImage: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#777",
    fontSize: 12,
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
