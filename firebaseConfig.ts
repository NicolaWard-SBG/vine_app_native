import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaE5CHyypSqvCs4HmCYQxY_Kb8ck3qmdw",
  authDomain: "vine-app-62ca5.firebaseapp.com",
  projectId: "vine-app-62ca5",
  storageBucket: "vine-app-62ca5.firebasestorage.app",
  messagingSenderId: "1081095440942",
  appId: "1:1081095440942:web:8417ae3e4db7b079ec2dbf",
  measurementId: "G-9YS69D8XFQ",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
