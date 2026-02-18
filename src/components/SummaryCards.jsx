import { useState, useEffect } from "react";

// ─── Summary Cards (Emerald Edition) ──────────────────────────────────
export default function SummaryCards({ transactions, theme: t }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

    const income = transactions.filter(tx => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
    const expense = transactions.filter(tx => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
    const balance = income - expense;

    const cards = [
        { label: "Total Balance", value: balance, icon: "🏦", gradient: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,78,59,0.4))", glow: "rgba(16,185,129,0.15)", prefix: "₹" },
        { label: "Total Income", value: income, icon: "💎", gradient: "linear-gradient(135deg, rgba(52,211,153,0.3), rgba(16,185,129,0.4))", glow: "rgba(52,211,153,0.15)", prefix: "+₹" },
        { label: "Total Expense", value: expense, icon: "💸", gradient: "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(217,119,6,0.4))", glow: "rgba(251,191,36,0.15)", prefix: "-₹" },
    ];

    return (
        <>
            <style>{`
                .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                .summary-card {
                    position: relative; overflow: hidden; border-radius: 28px; padding: 32px 28px;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
                    display: flex; flexDirection: column; justify-content: space-between; min-height: 180px;
                }
                .summary-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
                .summary-card::before {
                    content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.1);
                    backdrop-filter: blur(8px); z-index: 1;
                }
                @media (max-width: 768px) { .summary-grid { grid-template-columns: 1fr; gap: 18px; } }
            `}</style>
            <div className="summary-grid">
                {cards.map((c, i) => (
                    <div key={i} className="summary-card" style={{
                        background: c.gradient,
                        border: `1px solid rgba(255,255,255,0.1)`,
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(40px)",
                        transitionDelay: `${0.1 + i * 0.1}s`,
                    }}>
                        {/* Glow effect */}
                        <div style={{
                            position: "absolute", top: "-20%", right: "-10%", width: "70%", height: "70%",
                            background: "rgba(255,255,255,0.15)", filter: "blur(40px)", borderRadius: "50%", zIndex: 0
                        }} />

                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <div style={{ fontSize: 36, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>{c.icon}</div>
                                <div style={{
                                    background: "rgba(255,255,255,0.15)", padding: "5px 12px", borderRadius: 12,
                                    fontSize: 10, fontWeight: 800, color: "white", letterSpacing: 1.5,
                                    backdropFilter: "blur(4px)"
                                }}>LIVE</div>
                            </div>

                            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 3, color: "rgba(255,255,255,0.8)", marginBottom: 8, fontWeight: 700 }}>{c.label}</div>
                            <div style={{
                                fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: "white",
                                letterSpacing: -1, textShadow: "0 2px 10px rgba(0,0,0,0.1)"
                            }}>
                                {c.prefix}{Math.abs(c.value).toLocaleString("en-IN")}
                            </div>

                            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: "50%", background: "#fff",
                                    boxShadow: "0 0 15px #fff", animation: "pulse 2s infinite"
                                }} />
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Real-time sync</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
