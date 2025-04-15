import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebaseConfig";

const STORAGE_KEY = "wines";

export const getWinesFromStorage = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWineToStorage = async (wine: any) => {
  const wines = await getWinesFromStorage();
  const newWine = {
    ...wine,
    id: Date.now(),
    synced: false,
    userId: auth.currentUser?.uid,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...wines, newWine]));
  return newWine;
};

export const updateWinesInStorage = async (updated: any[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteWineFromStorage = async (id: number) => {
  const wines = await getWinesFromStorage();
  const updated = wines.filter((wine: any) => wine.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
