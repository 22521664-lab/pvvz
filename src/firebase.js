import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC-RlafEtQu9h87pULocjugWW1EFXmY4o4",
  authDomain: "chatapp-nhom10.firebaseapp.com",
  projectId: "chatapp-nhom10",
  storageBucket: "chatapp-nhom10.firebasestorage.app",
  messagingSenderId: "196242704733",
  appId: "1:196242704733:web:30b64a863e7d23090a00b4",
 databaseURL: "https://chatapp-nhom10-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { localCache: persistentLocalCache() });
export const rtdb = getDatabase(app);
