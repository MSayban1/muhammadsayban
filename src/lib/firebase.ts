import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBbhNtCogwBCBzX2ok7ifcEqMP8jxTFWaA",
  authDomain: "test-8febe.firebaseapp.com",
  databaseURL: "https://test-8febe-default-rtdb.firebaseio.com",
  projectId: "test-8febe",
  storageBucket: "test-8febe.firebasestorage.app",
  messagingSenderId: "690146701026",
  appId: "1:690146701026:web:2bb4be6fb4426ad6cff8bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
