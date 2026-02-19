// ─── Transaction Store (Firestore-backed) ─────────────────────────────────
import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "transactions";

const transactionStore = {
    /** Get all transactions for a user */
    list: async (uid) => {
        try {
            // Fetch by UID only to avoid composite index requirement initially
            const q = query(
                collection(db, COLLECTION_NAME),
                where("uid", "==", uid)
            );
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                amount: Number(doc.data().amount) || 0,
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
            }));

            // Sort manually by createdAt (newest first)
            return items.sort((a, b) => {
                // If createdAt is missing (pending sync), treat it as "now"
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Date.now();
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Date.now();
                return dateB - dateA;
            });
        } catch (error) {
            console.error("🔥 Firestore List Error:", error);
            // If it's a permission error, let the user know
            if (error.code === 'permission-denied') {
                alert("Permission Denied: Please check your Firestore rules.");
            }
            return [];
        }
    },

    /** Add a new transaction */
    add: async (uid, txn) => {
        try {
            const newTxn = {
                ...txn,
                uid,
                createdAt: serverTimestamp(),
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newTxn);
            console.log("✅ Firestore: Document added with ID", docRef.id);
            return { id: docRef.id, ...newTxn };
        } catch (error) {
            console.error("🔥 Firestore Add Error:", error);
            if (error.code === 'permission-denied') {
                alert("Permission Denied: Could not add transaction. Check your Firestore rules.");
            }
            throw error;
        }
    },

    /** Update an existing transaction by id */
    update: async (uid, id, updates) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);
            return { id, ...updates };
        } catch (error) {
            console.error("🔥 Firestore Update Error:", error);
            throw error;
        }
    },

    /** Delete a transaction by id */
    remove: async (uid, id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("🔥 Firestore Delete Error:", error);
            throw error;
        }
    },

    /** Seed demo data if user has no transactions */
    seedIfEmpty: async (uid) => {
        try {
            const txns = await transactionStore.list(uid);
            if (txns.length > 0) return txns;

            const demo = [
                { title: "Salary", amount: 5000, type: "income", category: "Salary", date: "2025-02-01" },
                { title: "Freelance Project", amount: 2500, type: "income", category: "Freelance", date: "2025-02-05" },
                { title: "Investment Return", amount: 1000, type: "income", category: "Investments", date: "2025-02-10" },
                { title: "Rent", amount: 400, type: "expense", category: "Housing", date: "2025-02-01" },
                { title: "Groceries", amount: 120, type: "expense", category: "Food", date: "2025-02-03" },
                { title: "Electric Bill", amount: 85, type: "expense", category: "Utilities", date: "2025-02-04" },
                { title: "Gym Membership", amount: 45, type: "expense", category: "Health", date: "2025-02-06" },
                { title: "Netflix", amount: 15, type: "expense", category: "Entertainment", date: "2025-02-07" },
                { title: "Uber Rides", amount: 60, type: "expense", category: "Transport", date: "2025-02-08" },
                { title: "Coffee Shop", amount: 25, type: "expense", category: "Food", date: "2025-02-12" },
                { title: "New Headphones", amount: 120, type: "expense", category: "Shopping", date: "2025-02-14" },
                { title: "Online Course", amount: 74, type: "expense", category: "Education", date: "2025-02-15" },
            ];

            await Promise.all(demo.map(d => transactionStore.add(uid, d)));
            return transactionStore.list(uid);
        } catch (error) {
            console.error("🔥 Seeding Error:", error);
            return [];
        }
    },
};

export const CATEGORIES = [
    "Salary", "Freelance", "Investments", "Housing", "Food",
    "Utilities", "Health", "Entertainment", "Transport", "Shopping", "Education", "Other"
];

export default transactionStore;
