// src/firebase.js
// Firebase v9+ modular SDK
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if config is valid (not empty or placeholder)
const isValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
  !firebaseConfig.apiKey.includes('your_');

let app;
let auth;
let db;
let storage;

if (isValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("🔥 Firebase initialized successfully.");
  } catch (err) {
    console.error("❌ Firebase initialization error:", err);
  }
} else {
  console.warn("⚠️ Firebase configuration missing or using placeholders. Some features will be disabled.");
  // Provide null/mock exports to prevent import errors in other files
  app = null;
  auth = { onAuthStateChanged: (cb) => { cb(null); return () => {}; } }; // Mock auth
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;

