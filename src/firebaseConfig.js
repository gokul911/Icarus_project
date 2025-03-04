import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0HXs6wVNIOu2DgS90uWfIQHiQxMSpZ4A",
  authDomain: "solar-system-46b9f.firebaseapp.com",
  projectId: "solar-system-46b9f",
  storageBucket: "solar-system-46b9f.firebasestorage.app",
  messagingSenderId: "374677752946",
  appId: "1:374677752946:web:7b72a810a9f98d83e746eb",
  measurementId: "G-PV6JCJF3L9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
