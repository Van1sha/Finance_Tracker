// ─── Firebase Email/Password & Verification Logic ────────────────────────────────
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Signs up a new user and sends a verification email.
 */
export async function firebaseSignUp(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name
    await updateProfile(user, { displayName: name });

    // Send verification email with ActionCodeSettings for local dev
    // This helps Firebase know where to redirect after clicking the link
    const actionCodeSettings = {
        url: window.location.origin, // Redirects back to your app
        handleCodeInApp: true,
    };

    try {
        await sendEmailVerification(user, actionCodeSettings);
    } catch (verifyError) {
        console.error("Verification Email Error:", verifyError);
        // We don't throw here so the user is still created, but we should let them know
        throw new Error("User created, but failed to send verification email. " + verifyError.message);
    }

    return mapUser(user);
}

/**
 * Signs in an existing user directly.
 */
export async function firebaseLogin(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(userCredential.user);
}

/**
 * Resends the verification email.
 */
export async function resendVerification() {
    if (auth.currentUser) {
        const actionCodeSettings = {
            url: window.location.origin,
            handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
    }
}

/**
 * Maps Firebase User to application user format.
 */
export function mapUser(user) {
    if (!user) return null;
    const name = user.displayName || user.email.split('@')[0];
    return {
        uid: user.uid,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: user.email,
        emailVerified: user.emailVerified,
        avatar: name.slice(0, 2).toUpperCase(),
        phone: user.phoneNumber || null,
    };
}

// Logout
export async function firebaseLogout() {
    await signOut(auth);
}

export { auth, onAuthStateChanged };
