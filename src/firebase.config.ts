
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Configuration is sourced from environment variables for Vercel deployment.
// Fallback values are provided for the local development environment.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAPNwGyz-28BnShi22uW6w6X5ckG9MI6gQ",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "public-fic.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://public-fic-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "public-fic",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "public-fic.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "390455311469",
  appId: process.env.FIREBASE_APP_ID || "1:390455311469:web:3e9b813ed8359e0661d364",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-67LZKE6Y8N"
};

let app: FirebaseApp;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

export const firebaseApp = app;
export const firebaseAuth: Auth = getAuth(app);
export const firebaseDatabase: Database = getDatabase(app);
