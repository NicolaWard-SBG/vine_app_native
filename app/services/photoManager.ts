import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert } from "react-native";

async function ensurePermissions() {
  // Request both camera & library permissions in one place
  const cam = await ImagePicker.requestCameraPermissionsAsync();
  const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!cam.granted) {
    Alert.alert(
      "Permission Required",
      "Camera access is required to take pictures.",
      [{ text: "OK" }]
    );
  }
  if (!lib.granted) {
    Alert.alert(
      "Permission Required",
      "Media library access is required to select photos.",
      [{ text: "OK" }]
    );
  }
  return cam.granted && lib.granted;
}

/**
 * Compress and resize an image to reduce file size
 * @param uri Original image URI
 * @returns Compressed image URI
 */
async function compressImage(uri: string): Promise<string> {
  try {
    // Resize to 600x800 max dimensions and compress to 70% quality
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error("Image compression failed:", error);
    return uri; // Return original if compression fails
  }
}

/**
 * Launch the camera and return a compressed image URI (or null if cancelled).
 */
export async function takePhoto(): Promise<string | null> {
  const ok = await ensurePermissions();
  if (!ok) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });

  if (result.canceled || !result.assets.length) return null;

  // Apply additional compression to the selected image
  return await compressImage(result.assets[0].uri);
}

/**
 * Launch the image library and return a compressed image URI (or null if cancelled).
 */
export async function pickFromLibrary(): Promise<string | null> {
  const ok = await ensurePermissions();
  if (!ok) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });

  if (result.canceled || !result.assets.length) return null;

  // Apply additional compression to the selected image
  return await compressImage(result.assets[0].uri);
}
