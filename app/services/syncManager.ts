import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";
import { getWinesFromStorage, updateWinesInStorage } from "./storage";

export const syncWines = async () => {
  if (!auth.currentUser) return;

  const wines = await getWinesFromStorage();
  const unsynced = wines.filter((w: any) => !w.synced);

  for (const wine of unsynced) {
    try {
      const wineData = {
        ...wine,
        userId: wine.userId || auth.currentUser.uid,
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "wines"), wineData);

      // Update local wine with sync status and Firestore ID
      wine.synced = true;
      wine.firebaseId = docRef.id;
    } catch (e) {
      console.log("Sync failed for wine:", wine.wineName, e);
    }
  }

  await updateWinesInStorage(wines);
};

export const fetchUserWines = async () => {
  if (!auth.currentUser) return [];

  try {
    const q = query(
      collection(db, "wines"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const firebaseWines = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      firebaseId: doc.id,
      synced: true,
    }));

    // Get local wines
    const localWines = await getWinesFromStorage();

    // Create a map for merging, using id as key
    const mergedWinesMap = new Map();

    // First add all local wines
    localWines.forEach((wine: any) => {
      mergedWinesMap.set(wine.id, wine);
    });

    // Then override with Firebase wines (prioritizing remote data)
    firebaseWines.forEach((wine: any) => {
      if (mergedWinesMap.has(wine.id)) {
        // Update existing wine with Firebase data (preserving local id)
        mergedWinesMap.set(wine.id, {
          ...wine,
          synced: true,
        });
      } else {
        // Add new wine from Firebase
        mergedWinesMap.set(wine.id, wine);
      }
    });

    const allWines = Array.from(mergedWinesMap.values());

    // Update local storage with merged wines
    await updateWinesInStorage(allWines);

    return allWines;
  } catch (error) {
    console.error("Error fetching wines:", error);
    return [];
  }
};

export const deleteWineFromFirebase = async (firebaseId: string) => {
  if (!firebaseId || !auth.currentUser) return;

  try {
    await deleteDoc(doc(db, "wines", firebaseId));
  } catch (error) {
    console.error("Error deleting wine from Firebase:", error);
  }
};
