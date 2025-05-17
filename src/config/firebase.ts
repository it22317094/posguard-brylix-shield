
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9S9fP2wHX8UTuwRR26Y9Sls0DbMyaqoc",
  authDomain: "isp-chatbot.firebaseapp.com",
  databaseURL: "https://isp-chatbot-default-rtdb.firebaseio.com",
  projectId: "isp-chatbot",
  storageBucket: "isp-chatbot.firebasestorage.app",
  messagingSenderId: "16927512964",
  appId: "1:16927512964:web:62f88bb6866df195d8e5d1",
  measurementId: "G-LEGP394Z8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
