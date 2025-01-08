// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "full-stack-mern-estate.firebaseapp.com",
  projectId: "full-stack-mern-estate",
  storageBucket: "full-stack-mern-estate.firebasestorage.app",
  messagingSenderId: "465352910576",
  appId: "1:465352910576:web:a06b552cb5ecf87ccd4435"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);