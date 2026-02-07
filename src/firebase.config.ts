
import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAPNwGyz-28BnShi22uW6w6X5ckG9MI6gQ",
  authDomain: "public-fic.firebaseapp.com",
  databaseURL: "https://public-fic-default-rtdb.firebaseio.com",
  projectId: "public-fic",
  storageBucket: "public-fic.firebasestorage.app",
  messagingSenderId: "390455311469",
  appId: "1:390455311469:web:3e9b813ed8359e0661d364",
  measurementId: "G-67LZKE6Y8N"
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
