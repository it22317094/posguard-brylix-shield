
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9S9fP2wHX8UTuwRR26Y9Sls0DbMyaqoc",
  authDomain: "isp-chatbot.firebaseapp.com",
  databaseURL: "https://isp-chatbot-default-rtdb.firebaseio.com",
  projectId: "isp-chatbot",
  storageBucket: "isp-chatbot.firebasestorage.app",
  messagingSenderId: "16927512964",
  appId: "1:16927512964:web:56de0199292c4b28d8e5d1",
  measurementId: "G-GYEJG12M1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
