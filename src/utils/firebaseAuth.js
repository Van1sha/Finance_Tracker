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
        // Map common errors for better debugging
        let errorMsg = "User created, but failed to send verification email.";
        if (verifyError.code === 'auth/too-many-requests') {
            errorMsg += " Too many requests. Please try again later.";
        } else if (verifyError.code === 'auth/unauthorized-domain') {
            errorMsg += " This domain is not authorized in Firebase Console.";
        } else {
            errorMsg += " Error code: " + (verifyError.code || "unknown") + ". " + verifyError.message;
        }
        throw new Error(errorMsg);
    }

    return mapUser(user);
}

/**
 * Signs in an existing user and enforces email verification.
 */
export async function firebaseLogin(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // No email verification check — existing users can log in directly
    return mapUser(user);
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
        try {
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
        } catch (e) {
            console.error("Resend Verification Error:", e);
            let msg = "Failed to resend verification link.";
            if (e.code === 'auth/too-many-requests') {
                msg = "Please wait a moment before trying again (Too many requests).";
            } else if (e.code === 'auth/unauthorized-domain') {
                msg = "Domain not authorized in Firebase Console.";
            } else {
                msg += " " + (e.code || e.message);
            }
            throw new Error(msg);
        }
    } else {
        throw new Error("No user is currently signed in to resend verification.");
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
