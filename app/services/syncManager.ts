import {
  setDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { getWinesFromStorage, updateWinesInStorage } from "./storage";

export const syncWines = async () => {
  if (!auth.currentUser) return;
  const wines = await getWinesFromStorage();
  const unsynced = wines.filter((w: any) => !w.synced);
  const updated = [...wines];

  for (const wine of unsynced) {
    try {
      const { synced, ...wineData } = wine;
      // Use the same ID for Firestore document
      const wineDocRef = doc(db, "wines", wine.id);
      await setDoc(wineDocRef, { ...wineData, userId: auth.currentUser.uid });
      const idx = updated.findIndex((w: any) => w.id === wine.id);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], synced: true };
      }
    } catch (e) {
      console.warn("Failed to sync", wine.id, e);
    }
  }

  await updateWinesInStorage(updated);
};

export const fetchUserWines = async () => {
  if (!auth.currentUser) return [];
  try {
    const q = query(
      collection(db, "wines"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const firebaseWines = querySnapshot.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id,
      synced: true,
    }));

    // Overwrite local storage with the latest from Firestore
    await updateWinesInStorage(firebaseWines);
    return firebaseWines;
  } catch (error) {
    console.error("Error fetching wines:", error);
    return [];
  }
};

export const deleteWineFromFirebase = async (id: string) => {
  if (!id || !auth.currentUser) return;

  try {
    await deleteDoc(doc(db, "wines", id));
    console.log("Successfully deleted wine from Firebase:", id);
    return true;
  } catch (error) {
    console.error("Error deleting wine from Firebase:", error);
    throw error;
  }
};
