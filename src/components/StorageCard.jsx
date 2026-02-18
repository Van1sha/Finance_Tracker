import { useState, useEffect } from "react";

// ─── Storage Card — localStorage Usage + Reset ────────────────────────────────
export default function StorageCard({ theme: t, onReset }) {
    const [usage, setUsage] = useState({ bytes: 0, keys: 0, formatted: "0 B" });
    const [confirmReset, setConfirmReset] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const calculate = () => {
        let total = 0;
        let keys = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            total += (key.length + val.length) * 2; // UTF-16 = 2 bytes per char
            keys++;
        }
        const formatted =
            total < 1024
                ? `${total} B`
                : total < 1048576
                    ? `${(total / 1024).toFixed(1)} KB`
                    : `${(total / 1048576).toFixed(2)} MB`;
        setUsage({ bytes: total, keys, formatted });
    };

    useEffect(() => {
        calculate();
        // Re-calculate on storage events
        const handler = () => calculate();
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    // Recalculate whenever the component re-renders (triggered by parent state changes)
    useEffect(() => { calculate(); });

    const handleReset = () => {
        // Clear all fintrak data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("fintrak_")) keysToRemove.push(key);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        setResetDone(true);
        setConfirmReset(false);
        calculate();
        setTimeout(() => {
            setResetDone(false);
            if (onReset) onReset();
        }, 1200);
    };

    const handleExport = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("fintrak_")) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fintrack_backup_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Usage bar — max localStorage is ~5MB
    const maxBytes = 5 * 1024 * 1024;
    const pct = Math.min((usage.bytes / maxBytes) * 100, 100);
    const barColor =
        pct < 50
            ? "linear-gradient(90deg, #3b82f6, #1d4ed8)"
            : pct < 80
                ? "linear-gradient(90deg, #f59e0b, #d97706)"
                : "linear-gradient(90deg, #ef4444, #dc2626)";

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
                .storage-container:hover { border-color: rgba(16,185,129,0.2) !important; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
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
                    background: "linear-gradient(90deg, #8b5cf6, #6d28d9)",
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
                    <div style={{ fontSize: 26, marginBottom: 8 }}>💾</div>
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
                        Local Storage
                    </div>
                    <div
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 26,
                            fontWeight: 700,
                            color: t.text,
                        }}
                    >
                        {usage.formatted}
                    </div>
                </div>
                <div
                    style={{
                        padding: "5px 10px",
                        borderRadius: 20,
                        background: t.bgInput,
                        border: `1px solid ${t.border}`,
                        fontSize: 11,
                        color: t.textMuted,
                        fontWeight: 600,
                    }}
                >
                    {usage.keys} keys
                </div>
            </div>

            {/* Usage bar */}
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                    }}
                >
                    <span
                        style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}
                    >
                        Usage
                    </span>
                    <span
                        style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}
                    >
                        {pct.toFixed(2)}% of 5 MB
                    </span>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: 6,
                        background: t.bgInput,
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${Math.max(pct, 0.5)}%`,
                            background: barColor,
                            borderRadius: 3,
                            transition: "width 0.5s ease",
                        }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Export Button */}
                <button
                    onClick={handleExport}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        border: "none",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                    }}
                >
                    📥 Export All Data
                </button>

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
                        ✓ All data cleared!
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
                            Confirm
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmReset(true)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: 10,
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.18)",
                            color: "#f87171",
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
                        🗑️ Reset All Data
                    </button>
                )}
            </div>
        </div>
    );
}
