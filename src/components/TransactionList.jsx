import { useState } from "react";

const catIcons = {
    Salary: "💰", Freelance: "💻", Investments: "📈", Housing: "🏠",
    Food: "🍱", Utilities: "⚡", Health: "🦷", Entertainment: "🎬",
    Transport: "🚕", Shopping: "🛒", Education: "🎓", Other: "✨",
};

// ─── Transaction List (Card Edition) ───────────────────────────
export default function TransactionList({ transactions, onEdit, onDelete, theme: t, readOnly }) {
    const [hoveredId, setHoveredId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        setDeletingId(id);
        setTimeout(() => { onDelete(id); setDeletingId(null); }, 300);
    };

    if (transactions.length === 0) {
        return (
            <div style={{
                textAlign: "center", padding: "80px 20px",
                background: t.bgCard, border: `1px solid ${t.border}`,
                borderRadius: 24, backdropFilter: "blur(12px)",
                marginTop: 24
            }}>
                <div style={{ fontSize: 64, marginBottom: 18 }}>🏝️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8 }}>Clear Skies!</div>
                <div style={{ fontSize: 14, color: t.textMuted }}>No transactions match your search or filters.</div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .txn-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 24px; }
                .txn-card { transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); cursor: pointer; }
                .txn-card:hover { transform: translateX(8px); background: ${t.bgCardHover} !important; border-color: ${t.borderFocus} !important; }
                @keyframes cardIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .txn-card { animation: cardIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
                .action-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; opacity: 0.7; }
                .action-btn:hover { opacity: 1; transform: scale(1.1); filter: brightness(1.2); }
                .action-btn:active { transform: scale(0.9); }
                @media (max-width: 640px) {
                    .txn-card { padding: 14px 16px !important; border-radius: 14px !important; flex-wrap: wrap; gap: 12px; }
                    .txn-card .txn-icon { width: 42px !important; height: 42px !important; border-radius: 12px !important; font-size: 20px !important; }
                    .txn-amount { font-size: 16px !important; }
                    .txn-title { font-size: 14px !important; }
                }
            `}</style>

            <div className="txn-grid">
                {transactions.map((txn) => (
                    <div key={txn.id} className="txn-card"
                        onMouseEnter={() => setHoveredId(txn.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                            padding: "20px 24px",
                            background: t.bgCard,
                            border: `1px solid ${t.border}`,
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backdropFilter: "blur(12px)",
                            opacity: deletingId === txn.id ? 0 : 1,
                            transform: deletingId === txn.id ? "scale(0.9) translateY(10px)" : "none",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1, minWidth: 0 }}>
                            <div className="txn-icon" style={{
                                width: 52, height: 52, borderRadius: 15,
                                background: txn.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                                border: `1px solid ${txn.type === "income" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                            }}>
                                {catIcons[txn.category] || "✨"}
                            </div>
                            <div>
                                <div className="txn-title" style={{ fontSize: 16, fontWeight: 700, color: t.textSecondary, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.title}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1.5 }}>{txn.category}</span>
                                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.border }}></span>
                                    <span style={{ fontSize: 12, color: t.textMuted }}>{new Date(txn.date).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                            <div style={{ textAlign: "right" }}>
                                <div className="txn-amount" style={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: txn.type === "income" ? "#10b981" : "#ef4444",
                                    fontFamily: "'DM Sans', sans-serif",
                                    marginBottom: 2
                                }}>
                                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: t.textFaint, textTransform: "uppercase" }}>{txn.type}</div>
                            </div>

                            {!readOnly && (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => onEdit(txn)} className="action-btn" style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 16 }}>✏️</button>
                                    <button onClick={() => handleDelete(txn.id)} className="action-btn" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>🗑️</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
