import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAinXfB9IYWDWDGZHrb0cVyhuWDuKmETuQ",
  authDomain: "taskify-a3dbb.firebaseapp.com",
  projectId: "taskify-a3dbb",
  storageBucket: "taskify-a3dbb.firebasestorage.app",
  messagingSenderId: "317225514526",
  appId: "1:317225514526:web:80fe810009c56e0ccda00f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);