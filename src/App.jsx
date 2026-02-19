import { useState, useCallback, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import AnimatedBackground from "./components/AnimatedBackground";
import { useTheme, themes } from "./utils/theme";
import { auth, onAuthStateChanged, mapUser } from "./utils/firebaseAuth";

// ─── Root — Dashboard-first, login optional, global animated background ──────
export default function App() {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [transitioning, setTrans] = useState(false);
    const [transDir, setTransDir] = useState("in");
    const { theme, toggleTheme } = useTheme();

    const [showGif, setShowGif] = useState(false);

    const t = themes[theme];

    // Define callbacks BEFORE the useEffect hooks that reference them
    const handleLogin = useCallback((u) => {
        setTransDir("in");
        setTrans(true);
        setTimeout(() => {
            setUser(u);
            setShowLogin(false);
            setTrans(false);
        }, 550);
    }, []);

    const handleLogout = useCallback(() => {
        setTransDir("out");
        setTrans(true);
        setTimeout(() => {
            setUser(null);
            setTrans(false);
        }, 550);
    }, []);

    const handleSignIn = useCallback(() => { setShowLogin(true); }, []);

    // Listen for Auth State Changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const mapped = mapUser(firebaseUser);
                setUser(mapped);
                if (firebaseUser.emailVerified && showLogin) {
                    handleLogin(mapped);
                }
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, [showLogin, handleLogin]);

    // Polling for email verification
    useEffect(() => {
        let interval;
        if (user && !user.emailVerified) {
            interval = setInterval(async () => {
                await auth.currentUser?.reload();
                if (auth.currentUser?.emailVerified) {
                    const updatedUser = mapUser(auth.currentUser);
                    setUser(updatedUser);
                    handleLogin(updatedUser);
                    clearInterval(interval);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [user, showLogin, handleLogin]);

    return (
        <>
            {/* Global style for body background to ensure theme toggle is visible */}
            <style>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    background: ${t.bg};
                    background-attachment: fixed;
                    transition: background 0.4s ease;
                    min-height: 100vh;
                    ${showLogin ? "overflow: hidden !important;" : ""}
                }
                #root { min-height: 100vh; }
            `}</style>

            {/* Global animated background — behind EVERYTHING */}
            <AnimatedBackground theme={theme} showGif={showGif} />

            <div style={{
                position: "relative", zIndex: 1,
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? `scale(${transDir === "in" ? 1.02 : 0.98})` : "none",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                minHeight: "100vh",
            }}>
                <Dashboard
                    user={user || null}
                    onLogout={handleLogout} // Trigger transition & clear user
                    onSignIn={handleSignIn}
                    theme={theme}
                    themeColors={t}
                    onToggleTheme={toggleTheme}
                    onFormStateChange={setShowGif}
                />

                {/* Login modal overlay */}
                {showLogin && (
                    <div style={{
                        position: "fixed", inset: 0, zIndex: 300,
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "flex-start",
                        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)",
                        overflowY: "auto", padding: "80px 20px 40px",
                        animation: "loginOverlayIn 0.3s ease both",
                    }}>
                        <style>{`@keyframes loginOverlayIn{from{opacity:0}to{opacity:1}}`}</style>
                        <button onClick={() => setShowLogin(false)} style={{
                            position: "fixed", top: 24, right: 28, width: 40, height: 40, borderRadius: 12,
                            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 310,
                        }}>✕</button>

                        <div style={{ width: "100%", maxWidth: 420 }}>
                            <LoginScreen onLogin={handleLogin} theme={theme} themeColors={t} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
