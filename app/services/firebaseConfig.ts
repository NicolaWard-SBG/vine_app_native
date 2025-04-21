import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaE5CHyypSqvCs4HmCYQxY_Kb8ck3qmdw",
  authDomain: "vine-app-62ca5.firebaseapp.com",
  projectId: "vine-app-62ca5",
  storageBucket: "vine-app-62ca5.appspot.com",
  messagingSenderId: "1081095440942",
  appId: "1:1081095440942:web:8417ae3e4db7b079ec2dbf",
  measurementId: "G-9YS69D8XFQ",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

export { app, auth };
