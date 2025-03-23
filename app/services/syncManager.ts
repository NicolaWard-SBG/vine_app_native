import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getWinesFromStorage, updateWinesInStorage } from "./storage";

export const syncWines = async () => {
  const wines = await getWinesFromStorage();
  const unsynced = wines.filter((w: any) => !w.synced);

  for (const wine of unsynced) {
    try {
      await addDoc(collection(db, "wines"), wine);
      wine.synced = true;
    } catch (e) {
      console.log("Sync failed for wine:", wine.wineName, e);
    }
  }

  await updateWinesInStorage(wines);
};
