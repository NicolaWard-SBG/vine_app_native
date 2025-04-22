import * as ImagePicker from "expo-image-picker";
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
 * Launch the camera and return a single image URI (or null if cancelled).
 */
export async function takePhoto(): Promise<string | null> {
  const ok = await ensurePermissions();
  if (!ok) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });
  return result.canceled || !result.assets.length ? null : result.assets[0].uri;
}

/**
 * Launch the image library and return a single image URI (or null if cancelled).
 */
export async function pickFromLibrary(): Promise<string | null> {
  const ok = await ensurePermissions();
  if (!ok) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });
  return result.canceled || !result.assets.length ? null : result.assets[0].uri;
}
