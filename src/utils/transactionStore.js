// ─── Transaction Store (localStorage-backed) ─────────────────────────────────
// Simulates Firebase Firestore — all data persisted in localStorage per user.

const STORAGE_KEY = "fintrak_transactions";

function getAll(uid) {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveAll(uid, txns) {
    localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(txns));
}

const transactionStore = {
    /** Get all transactions for a user */
    list: (uid) => getAll(uid),

    /** Add a new transaction */
    add: (uid, txn) => {
        const txns = getAll(uid);
        const newTxn = {
            ...txn,
            id: "txn_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            createdAt: new Date().toISOString(),
        };
        txns.unshift(newTxn);
        saveAll(uid, txns);
        return newTxn;
    },

    /** Update an existing transaction by id */
    update: (uid, id, updates) => {
        const txns = getAll(uid);
        const idx = txns.findIndex(t => t.id === id);
        if (idx === -1) return null;
        txns[idx] = { ...txns[idx], ...updates };
        saveAll(uid, txns);
        return txns[idx];
    },

    /** Delete a transaction by id */
    remove: (uid, id) => {
        const txns = getAll(uid).filter(t => t.id !== id);
        saveAll(uid, txns);
    },

    /** Seed demo data if user has no transactions */
    seedIfEmpty: (uid) => {
        if (getAll(uid).length > 0) return getAll(uid);
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
        demo.forEach(d => transactionStore.add(uid, d));
        return getAll(uid);
    },
};

export const CATEGORIES = [
    "Salary", "Freelance", "Investments", "Housing", "Food",
    "Utilities", "Health", "Entertainment", "Transport", "Shopping", "Education", "Other"
];

export default transactionStore;
