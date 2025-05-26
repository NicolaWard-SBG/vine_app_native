import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors/colors";
import { Wine } from "../../types";

export interface WineItemProps {
  wine: Wine;
  onDelete: (id: string) => void;
  onEdit: (wine: Wine) => void;
  onToggleFavourite: (id: string) => void; // Add this new prop
  swipeableRef?: (ref: any) => void;
}

export const WineItem: React.FC<WineItemProps> = ({
  wine,
  onDelete,
  onEdit,
  onToggleFavourite,
  swipeableRef,
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
        ref={swipeableRef}
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
            <View style={styles.wineHeader}>
              <View style={styles.wineHeaderText}>
                <Text style={styles.wineInfoText}>{wine.wineMaker}</Text>
                <Text style={styles.wineName}>{wine.wineName}</Text>
              </View>
              <TouchableOpacity
                style={styles.favouriteButton}
                onPress={() => onToggleFavourite(wine.id)}
              >
                <TouchableOpacity
                  style={styles.favouriteButton}
                  onPress={() => onToggleFavourite(wine.id)}
                >
                  <Image
                    source={
                      wine.isFavourite
                        ? require("../assets/icons/FavouritesIcon.png")
                        : require("../assets/icons/FavouritesIconOutline.png") // Outline icon for not favourite
                    }
                    style={styles.favouriteIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Text style={styles.wineInfoText}>{wine.grape}</Text>
            <Text style={styles.wineInfoText}>{wine.type}</Text>
            <Text style={styles.wineInfoText}>{wine.year}</Text>
            <Text style={styles.wineInfoText}>{wine.rating}</Text>
            <Text
              style={styles.wineInfoText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {wine.region}
            </Text>
            <View style={styles.tagRow}>
              {(wine.foodPairings || []).map((tag) => (
                <View key={tag} style={styles.foodTag}>
                  <Text style={styles.itemTagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tagRow}>
              {(wine.attributeTags || []).map((tag) => (
                <View key={tag} style={styles.attributeTag}>
                  <Text style={styles.itemTagText}>{tag}</Text>
                </View>
              ))}
            </View>
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
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  wineInfo: {
    flex: 1,
  },
  wineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  wineHeaderText: {
    flex: 1,
  },
  favouriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  wineInfoText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#333",
  },
  wineName: {
    fontFamily: "CelsiusFlower",
    fontSize: 20,
  },
  imageContainer: {
    position: "relative",
    width: 80,
    height: 120,
    marginRight: 10,
  },
  wineLabelImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: "cover",
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
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  foodTag: {
    backgroundColor: colors.seashell,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  attributeTag: {
    backgroundColor: colors.tangerine,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  itemTagText: { fontSize: 12 },
  favouriteIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
