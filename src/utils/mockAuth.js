import { nameFromEmail } from "./helpers";

// ─── In-memory user store ─────────────────────────────────────────────────────
// Simulates Firebase Auth — keys are lowercase emails.
// In production: replace with Firebase signInWithEmailAndPassword / createUserWithEmailAndPassword
const userStore = {};

const mockAuth = {
    login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 1400));
        const key = email.trim().toLowerCase();
        const found = userStore[key];
        if (!found) {
            const err = new Error("No account found for this email.");
            err.code = "NO_ACCOUNT";
            throw err;
        }
        if (found.password !== password) {
            const err = new Error("Incorrect password. Please try again.");
            err.code = "WRONG_PASSWORD";
            throw err;
        }
        return {
            name: found.name,
            email: found.email,
            avatar: found.avatar,
            uid: found.uid,
        };
    },

    signup: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 1400));
        const key = email.trim().toLowerCase();
        if (userStore[key]) {
            const err = new Error("An account already exists for this email.");
            err.code = "ALREADY_EXISTS";
            throw err;
        }
        if (password.length < 4) {
            throw new Error("Password must be at least 4 characters.");
        }
        const displayName = name.trim() || nameFromEmail(email);
        const avatar = displayName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        const uid = "usr_" + Date.now();
        userStore[key] = {
            name: displayName,
            email: email.trim(),
            avatar,
            password,
            uid,
        };
        return { name: displayName, email: email.trim(), avatar, uid };
    },

    logout: async () => {
        await new Promise((r) => setTimeout(r, 600));
    },
};

export default mockAuth;
