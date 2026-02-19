// ─── Firebase Configuration ───────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKpSMKQy08uoBLvdGpcxfZ7Fs_tfmFFpk",
    authDomain: "personal-f1tness-tracker.firebaseapp.com",
    projectId: "personal-f1tness-tracker",
    storageBucket: "personal-f1tness-tracker.firebasestorage.app",
    messagingSenderId: "298153697425",
    appId: "1:298153697425:web:81ff284ceeaddd16101f30",
    measurementId: "G-D5MQZZJDDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
