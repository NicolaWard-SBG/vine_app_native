import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { fetchUserWines } from "./syncManager";

export const initializeAuthListener = () => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, fetch their wines
      await fetchUserWines();
    }
  });
};
