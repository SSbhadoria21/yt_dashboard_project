// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJJuE-45WLBPMftpGd4IQxlLgxVYMsdb8",
  authDomain: "yt-dashboard-72ae0.firebaseapp.com",
  projectId: "yt-dashboard-72ae0",
  storageBucket: "yt-dashboard-72ae0.firebasestorage.app",
  messagingSenderId: "923389987623",
  appId: "1:923389987623:web:a3ebd90d0cd17133e5f702"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore(app);
export default app;