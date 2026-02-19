import { useState, useEffect } from "react";
import transactionStore from "../utils/transactionStore";

// ─── Cloud Status Card — Firestore Status + Secure Reset ────────────────────────
export default function StorageCard({ theme: t, onReset, user }) {
    const [status, setStatus] = useState("Connected");
    const [confirmReset, setConfirmReset] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const uid = user?.uid || "guest_demo";

    const handleReset = async () => {
        setResetDone(true);
        setConfirmReset(false);

        // In a real app, you might want to call a specific 'clearAll' method
        // For now, we'll manually remove all transactions fetched
        const txns = await transactionStore.list(uid);
        await Promise.all(txns.map(t => transactionStore.remove(uid, t.id)));

        setTimeout(() => {
            setResetDone(false);
            if (onReset) onReset();
        }, 1200);
    };

    return (
        <div
            className="storage-container"
            style={{
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: 18,
                padding: "22px",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(12px)",
            }}
        >
            <style>{`
                .storage-container { transition: all 0.4s ease; border: 1px solid rgba(255,255,255,0.06); }
                .storage-container:hover { border-color: rgba(59,130,246,0.3) !important; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
                button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
                button:hover { 
                    transform: translateY(-2px); 
                    filter: brightness(1.1);
                }
                button:active { transform: translateY(0) scale(0.98); }
            `}</style>

            {/* Top accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                }}
            />

            {/* Header row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                }}
            >
                <div>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>☁️</div>
                    <div
                        style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            color: t.labelColor,
                            fontWeight: 600,
                            marginBottom: 4,
                        }}
                    >
                        Cloud Database
                    </div>
                    <div
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 24,
                            fontWeight: 700,
                            color: t.text,
                        }}
                    >
                        {status}
                    </div>
                </div>
                <div
                    style={{
                        padding: "5px 12px",
                        borderRadius: 20,
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        fontSize: 10,
                        color: "#10b981",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 5
                    }}
                >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    LIVE
                </div>
            </div>

            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20, lineHeight: 1.5 }}>
                Your data is securely stored and synced in real-time with Firebase Firestore.
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Reset Section */}
                {resetDone ? (
                    <div
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: 10,
                            background: "rgba(16,185,129,0.12)",
                            border: "1px solid rgba(16,185,129,0.3)",
                            color: "#10b981",
                            fontSize: 13,
                            fontWeight: 700,
                            textAlign: "center",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        ✓ Cloud data cleared!
                    </div>
                ) : confirmReset ? (
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => setConfirmReset(false)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: 10,
                                background: t.bgInput,
                                border: `1px solid ${t.border}`,
                                color: t.textMuted,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReset}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                border: "none",
                                color: "white",
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
                            }}
                        >
                            Wipe Data
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmReset(true)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: 10,
                            background: "rgba(239,68,68,0.05)",
                            border: `1px solid ${t.border}`,
                            color: t.textMuted,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        🗑️ Reset Cloud Data
                    </button>
                )}
            </div>
        </div>
    );
}
