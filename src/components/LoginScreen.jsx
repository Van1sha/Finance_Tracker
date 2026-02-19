import { useState, useEffect, useRef } from "react";
import { firebaseLogin, firebaseSignUp, resendVerification } from "../utils/firebaseAuth";

// ─── Email/Password Login & Signup Screen ─────────────────────────────────────
export default function LoginScreen({ onLogin, theme, themeColors: t }) {
    const [mode, setMode] = useState("login"); // login | signup | verify
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [focus, setFocus] = useState(null);
    const [mounted, setMounted] = useState(false);
    const formRef = useRef(null);

    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    const shake = () => {
        if (!formRef.current) return;
        formRef.current.style.animation = "none";
        setTimeout(() => { if (formRef.current) formRef.current.style.animation = "shake 0.45s ease"; }, 10);
    };

    const handleAction = async () => {
        setError(null);

        // 1. Basic Validation
        if (!email || !password || (mode === "signup" && !name)) {
            setError("Please fill in all fields.");
            shake();
            return;
        }

        // 2. Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            shake();
            return;
        }

        // 3. Password Length Validation (Firebase requires min 6)
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            shake();
            return;
        }

        setLoading(true);
        try {
            if (mode === "login") {
                const user = await firebaseLogin(email, password);
                onLogin(user);
            } else {
                await firebaseSignUp(name, email, password);
                setMode("verify");
            }
        } catch (e) {
            shake();
            if (e.code === "auth/email-not-verified") {
                setMode("verify");
                return;
            }
            // 4. Firebase Error Mapping
            console.error("Auth Error:", e.code, e.message);
            let msg = e.message || "Authentication failed.";
            if (e.code === "auth/email-already-in-use") msg = "This email is already registered.";
            if (e.code === "auth/invalid-email") msg = "Invalid email format.";
            if (e.code === "auth/weak-password") msg = "Password is too weak.";
            if (e.code === "auth/user-not-found") msg = "No account found with this email.";
            if (e.code === "auth/wrong-password") msg = "Incorrect password.";
            if (e.code === "auth/invalid-credential") msg = "Invalid email or password.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const [resendStatus, setResendStatus] = useState(null); // null | sending | sent

    const handleResend = async () => {
        setResendStatus("sending");
        try {
            await resendVerification();
            setResendStatus("sent");
            setTimeout(() => setResendStatus(null), 3000);
        } catch (e) {
            setError(e.message);
            setResendStatus(null);
        }
    };

    const inputStyle = (field) => ({
        width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 13, outline: "none",
        background: focus === field
            ? (theme === "dark" ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)")
            : (theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
        border: `1px solid ${focus === field
            ? "rgba(59,130,246,0.6)"
            : (theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)")}`,
        color: t?.text || (theme === "dark" ? "#f0f4ff" : "#1e293b"),
        fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
        boxShadow: focus === field ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
    });

    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif", position: "relative",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(3deg)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #0d1b2a inset!important;-webkit-text-fill-color:#f0f4ff!important;}
        .login-card{width:100%;max-width:400px;}
        @media (max-width: 480px) {
            .login-card { max-width: 100% !important; }
        }
        button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        button:hover { 
            transform: translateY(-2px); 
            filter: brightness(1.1);
            box-shadow: 0 8px 25px rgba(59,130,246,0.4) !important;
        }
        button:active { transform: translateY(0) scale(0.98); }
        .mode-link:hover { text-decoration: underline; opacity: 0.8; }
      `}</style>

            <div className="login-card" style={{
                position: "relative", zIndex: 10,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
                margin: "auto"
            }}>

                <div ref={formRef} style={{
                    background: theme === "dark" ? "rgba(20,25,35,0.7)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(40px)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 16,
                    padding: "18px 20px", boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
                }}>
                    {/* Logo */}
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, marginBottom: 12,
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
                        animation: "logoFloat 3s ease-in-out infinite",
                    }}>💎</div>

                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: t?.text || "#f8fafc", marginBottom: 2 }}>
                        {mode === "login" && "Welcome back."}
                        {mode === "signup" && "Create account."}
                        {mode === "verify" && "Verify Email."}
                    </div>
                    <div style={{ fontSize: 12, color: t?.textMuted || "rgba(255,255,255,0.38)", marginBottom: 14 }}>
                        {mode === "login" && "Log in to your command center"}
                        {mode === "signup" && "Start your financial journey with us"}
                        {mode === "verify" && "Check your inbox for the link"}
                    </div>

                    {mode !== "verify" ? (
                        <>
                            {mode === "signup" && (
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ display: "block", fontSize: 9, fontWeight: 700, color: t?.labelColor || "rgba(255,255,255,0.32)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                                    <input style={inputStyle("name")} type="text" placeholder="Alex Morgan" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} disabled={loading} />
                                </div>
                            )}
                            <div style={{ marginBottom: 10 }}>
                                <label style={{ display: "block", fontSize: 9, fontWeight: 700, color: t?.labelColor || "rgba(255,255,255,0.32)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
                                <input style={inputStyle("email")} type="email" placeholder="alex@example.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} disabled={loading} />
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 9, fontWeight: 700, color: t?.labelColor || "rgba(255,255,255,0.32)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                                <input style={inputStyle("password")} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocus("password")} onBlur={() => setFocus(null)} disabled={loading} onKeyDown={e => e.key === "Enter" && handleAction()} />
                            </div>

                            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 8, marginBottom: 10, color: "#fca5a5", fontSize: 11 }}>{error}</div>}

                            <button onClick={handleAction} disabled={loading} style={{
                                width: "100%", padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 700,
                                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "white", border: "none",
                                boxShadow: "0 6px 20px rgba(59,130,246,0.3)", cursor: "pointer",
                                opacity: loading ? 0.7 : 1, transition: "all 0.2s ease",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 7
                            }}>
                                {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
                                {mode === "login" ? "Sign In →" : "Create Account →"}
                            </button>

                            <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: t?.textMuted || "rgba(255,255,255,0.35)" }}>
                                {mode === "login" ? (
                                    <>Don't have an account? <span className="mode-link" onClick={() => { setMode("signup"); setError(null); }} style={{ color: "#60a5fa", cursor: "pointer", fontWeight: 600, transition: "all 0.2s ease" }}>Sign up</span></>
                                ) : (
                                    <>Already have an account? <span className="mode-link" onClick={() => { setMode("login"); setError(null); }} style={{ color: "#60a5fa", cursor: "pointer", fontWeight: 600, transition: "all 0.2s ease" }}>Login</span></>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 40, marginBottom: 14 }}>📩</div>
                            <div style={{ color: t?.textSecondary || "#f0f4ff", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                                We've sent a <strong>secure link</strong> to <strong>{email}</strong>.
                                <br /><br />
                                Click the link in your email to instantly authorize your account.
                            </div>
                            <button onClick={handleResend} style={{
                                width: "100%", padding: 11, borderRadius: 10,
                                background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                                color: t?.text || "white", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 10
                            }}>
                                {resendStatus === "sending" ? "Sending..." : resendStatus === "sent" ? "✅ Sent! Check again" : "Resend secure link"}
                            </button>
                            <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 12, cursor: "pointer" }}>Back to Login</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
