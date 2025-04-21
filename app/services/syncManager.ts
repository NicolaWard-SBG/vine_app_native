import {
  setDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, db } from "./firebaseConfig";
import { getWinesFromStorage, updateWinesInStorage } from "./storage";

export const syncWines = async () => {
  if (!auth.currentUser) return;
  const wines = await getWinesFromStorage();
  const unsynced = wines.filter((w: any) => !w.synced);
  const updated = [...wines];
  const storage = getStorage();

  for (const wine of unsynced) {
    try {
      const { synced, ...wineData } = wine;
      let imageUrl = wineData.labelImage;

      // If it's a local file URI, upload to Firebase Storage
      if (wineData.labelImage?.startsWith("file://")) {
        const response = await fetch(wineData.labelImage);
        const blob = await response.blob();
        const imgRef = storageRef(
          storage,
          `wines/${auth.currentUser.uid}/${wine.id}.jpg`
        );
        await uploadBytes(imgRef, blob);
        imageUrl = await getDownloadURL(imgRef);
      }

      // Write doc with the (possibly updated) image URL
      const wineDocRef = doc(db, "wines", wine.id);
      await setDoc(wineDocRef, {
        ...wineData,
        labelImage: imageUrl,
        userId: auth.currentUser.uid,
      });

      // Mark synced and store the hosted URL locally
      const idx = updated.findIndex((w: any) => w.id === wine.id);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], synced: true, labelImage: imageUrl };
      }
    } catch (e) {
      console.warn("Failed to sync wine", wine.id, e);
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
    const snap = await getDocs(q);
    const firebaseWines = snap.docs.map((d) => ({
      ...d.data(),
      id: d.id,
      synced: true,
    }));
    await updateWinesInStorage(firebaseWines);
    return firebaseWines;
  } catch (e) {
    console.error("Error fetching wines:", e);
    return [];
  }
};

export const deleteWineFromFirebase = async (id: string) => {
  if (!id || !auth.currentUser) return;

  try {
    await deleteDoc(doc(db, "wines", id));
    console.log("Deleted wine", id);
    return true;
  } catch (e) {
    console.error("Error deleting wine:", e);
    throw e;
  }
};
