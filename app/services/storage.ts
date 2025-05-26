import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "./firebaseConfig";
import { collection, doc } from "firebase/firestore";

const STORAGE_KEY = "wines";

export const getWinesFromStorage = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWineToStorage = async (wineData: any) => {
  const wines = await getWinesFromStorage();

  // Generate a Firestore auto-ID for this wine
  const wineRef = doc(collection(db, "wines"));
  const id = wineRef.id;

  const newWine = {
    ...wineData,
    id,
    synced: false,
    isFavourite: false,
  };

  // Persist locally with that ID
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...wines, newWine]));
  return newWine;
};

export const updateWinesInStorage = async (updated: any[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteWineFromStorage = async (id: string) => {
  const wines = await getWinesFromStorage();
  const filtered = wines.filter((w: any) => w.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};
