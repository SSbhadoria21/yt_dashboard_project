
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "yt-dashboard-72ae0.firebaseapp.com",
  projectId: "yt-dashboard-72ae0",
  storageBucket: "yt-dashboard-72ae0.firebasestorage.app",
  messagingSenderId: "923389987623",
  appId: "1:923389987623:web:a3ebd90d0cd17133e5f702"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore(app);
export default app;