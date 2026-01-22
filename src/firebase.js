import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBpSJ6atHMQGJyERizTXFdEZhavZoR6tqI",
    authDomain: "new-education-era-2026.firebaseapp.com",
    projectId: "new-education-era-2026",
    storageBucket: "new-education-era-2026.firebasestorage.app",
    messagingSenderId: "82348306463",
    appId: "1:82348306463:web:9b6f47dc6b6d984e24652a",
    measurementId: "G-3QG7KGZ5M1"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // For Login/Signup
export const db = getFirestore(app); // For storing User Roles