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

export const syncWines = async () => {
  if (!auth.currentUser) return;
  console.log(">>> syncWines for user", auth.currentUser.uid);

  const wines = await getWinesFromStorage();
  const unsynced = wines.filter((w: any) => !w.synced);
  const updated = [...wines];
  const storage = getStorage();

  for (const wine of unsynced) {
    // Extract data, leave out `synced`
    const { synced, ...wineData } = wine;
    let imageUrl = wineData.labelImage;

    // If there's a local URI (not yet an HTTP URL), upload it
    if (imageUrl && !imageUrl.startsWith("http")) {
      try {
        let uploadUri = imageUrl;

        // On real iOS devices this may be ph:// or assets-library://
        if (
          uploadUri.startsWith("ph://") ||
          uploadUri.startsWith("assets-library://")
        ) {
          const asset = await MediaLibrary.createAssetAsync(uploadUri);
          const localCopy = `${FileSystem.documentDirectory}${wine.id}.jpg`;
          await FileSystem.copyAsync({ from: asset.uri, to: localCopy });
          uploadUri = localCopy;
        }

        // Fetch the local file and upload to Firebase Storage
        const response = await fetch(uploadUri);
        const blob = await response.blob();
        const imgRef = storageRef(
          storage,
          `wines/${auth.currentUser.uid}/${wine.id}.jpg`
        );
        await uploadBytes(imgRef, blob);
        imageUrl = await getDownloadURL(imgRef);
        console.log("  Uploaded image for wine", wine.id);
      } catch (err) {
        console.warn("  Image upload failed for wine", wine.id, err);
      }
    }

    // Now write or overwrite the Firestore document
    try {
      const wineDocRef = doc(db, "wines", wine.id);
      await setDoc(wineDocRef, {
        ...wineData,
        labelImage: imageUrl,
        userId: auth.currentUser.uid,
      });

      // Mark synced and persist the updated URL locally
      const idx = updated.findIndex((w: any) => w.id === wine.id);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], synced: true, labelImage: imageUrl };
      }
      console.log("  Synced wine", wine.id);
    } catch (err) {
      console.error("  Failed to write Firestore doc for wine", wine.id, err);
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
