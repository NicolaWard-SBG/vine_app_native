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
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { auth, db } from "./firebaseConfig";
import { getWinesFromStorage, updateWinesInStorage } from "./storage";
import { Wine } from "../../types";

export const syncWines = async (): Promise<void> => {
  if (!auth.currentUser) return;
  const wines: Wine[] = await getWinesFromStorage();
  const unsynced = wines.filter((w) => !w.synced);
  const updated = [...wines];
  const storage = getStorage();

  for (const wine of unsynced) {
    let imageUrl = wine.labelImage;

    // 1) If we have a local URI (file:// or ph://…), upload it
    if (imageUrl && !imageUrl.startsWith("http")) {
      // On iOS ph:// URIs need to be copied into a real file path first
      if (
        imageUrl.startsWith("ph://") ||
        imageUrl.startsWith("assets-library://")
      ) {
        const asset = await MediaLibrary.createAssetAsync(imageUrl);
        const localPath = `${FileSystem.documentDirectory}${wine.id}.jpg`;
        await FileSystem.copyAsync({ from: asset.uri, to: localPath });
        imageUrl = localPath;
      }

      try {
        // Read the file into a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Upload the blob to Cloud Storage
        const imgRef = storageRef(
          storage,
          `wines/${auth.currentUser.uid}/${wine.id}.jpg`
        );
        await uploadBytes(imgRef, blob);

        // Grab back the public URL
        imageUrl = await getDownloadURL(imgRef);
      } catch (err) {
        console.error("⚠️ Upload failed:", wine.id, err);
        // skip Firestore write this round
        continue;
      }
    }

    // 2) Write the Firestore document with that URL
    try {
      const { synced, ...wineData } = wine;
      const wineDoc = doc(db, "wines", wine.id);
      await setDoc(wineDoc, {
        ...wineData,
        labelImage: imageUrl || null,
        userId: auth.currentUser.uid,
      });

      // 3) Mark it synced locally
      const idx = updated.findIndex((w) => w.id === wine.id);
      if (idx > -1) {
        updated[idx] = { ...updated[idx], synced: true, labelImage: imageUrl };
      }
    } catch (err) {
      console.error("⚠️ Firestore write failed for", wine.id, err);
    }
  }

  // 4) Persist your updated local array
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
  // Delete the Firestore document
  try {
    await deleteDoc(doc(db, "wines", id));
    console.log("Deleted Firestore doc:", id);
    return true;
  } catch (err) {
    console.error("Error deleting Firestore doc:", err);
    throw err;
  }
};
