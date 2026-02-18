import { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import SummaryCards from "./SummaryCards";
import StorageCard from "./StorageCard";
import FilterBar from "./FilterBar";
import TransactionList from "./TransactionList";
import TransactionForm from "./TransactionForm";
import SpendingCharts from "./SpendingCharts";
import { firebaseLogout } from "../utils/firebaseAuth";
import transactionStore from "../utils/transactionStore";

const GUEST_UID = "guest_demo";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard({ user, onLogout, onSignIn, theme, themeColors: t, onToggleTheme, onFormStateChange }) {
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showForm, setShowForm] = useState(false);
    const [editingTxn, setEditingTxn] = useState(null);
    const [filters, setFilters] = useState({ search: "", type: "all", category: "all", sort: "newest" });

    // Trigger GIF background for NEW transactions only
    useEffect(() => {
        if (showForm && !editingTxn) {
            onFormStateChange?.(true);
        } else {
            onFormStateChange?.(false);
        }
    }, [showForm, editingTxn, onFormStateChange]);

    const [logoutPhase, setLogoutPhase] = useState("idle");
    const [showConfirm, setShowConfirm] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const isGuest = !user;
    const uid = user ? user.uid : GUEST_UID;

    useEffect(() => {
        const txns = transactionStore.seedIfEmpty(uid);
        setTransactions(txns);
    }, [uid]);

    const reload = () => setTransactions(transactionStore.list(uid));

    const handleSave = (data) => {
        if (isGuest) return;
        if (data.id) transactionStore.update(uid, data.id, data);
        else transactionStore.add(uid, data);
        reload();
        setShowForm(false);
        setEditingTxn(null);
    };

    const handleDelete = (id) => { if (isGuest) return; transactionStore.remove(uid, id); reload(); };
    const handleEdit = (txn) => { if (isGuest) return; setEditingTxn(txn); setShowForm(true); };

    const handleTabChange = (tab) => {
        if (tab === "add") {
            if (isGuest) { onSignIn(); return; }
            setEditingTxn(null); setShowForm(true);
        } else setActiveTab(tab);
    };

    const handleReset = () => { setTransactions([]); };

    const filtered = useMemo(() => {
        let list = [...transactions];
        if (filters.search) {
            const s = filters.search.toLowerCase();
            list = list.filter(x => x.title.toLowerCase().includes(s) || x.category.toLowerCase().includes(s));
        }
        if (filters.type !== "all") list = list.filter(x => x.type === filters.type);
        if (filters.category !== "all") list = list.filter(x => x.category === filters.category);
        switch (filters.sort) {
            case "oldest": list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
            case "newest": list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
            case "highest": list.sort((a, b) => b.amount - a.amount); break;
            case "lowest": list.sort((a, b) => a.amount - b.amount); break;
            default: break;
        }
        return list;
    }, [transactions, filters]);

    const confirmLogout = () => {
        setShowConfirm(false);
        setLogoutPhase("countdown");
        let c = 3; setCountdown(c);
        const iv = setInterval(() => {
            c--; setCountdown(c);
            if (c === 0) {
                clearInterval(iv);
                setLogoutPhase("bye");
                setTimeout(async () => {
                    await firebaseLogout();
                    onLogout();
                }, 1800);
            }
        }, 700);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes countDown{0%{transform:scale(2) rotate(-15deg);opacity:0}30%{opacity:1}80%{transform:scale(1) rotate(0deg);opacity:1}100%{transform:scale(0.8);opacity:0}}
        @keyframes ringExpand{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes byeIn{from{opacity:0;transform:scale(0.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes byeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes modalPop{from{transform:scale(0.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes iconWobble{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fabPulse{0%,100%{box-shadow:0 6px 24px rgba(59,130,246,0.4)}50%{box-shadow:0 6px 36px rgba(59,130,246,0.65)}}
        @keyframes guestBannerIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .dashboard-main { flex: 1; padding: 32px 36px; max-width: 1000px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }
        @media (max-width: 768px) { .dashboard-main { padding: 18px 14px; } }
        
        button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        button:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }
        button:active {
            transform: translateY(0) scale(0.98);
        }
        .guest-banner button:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 24px rgba(59,130,246,0.4) !important;
        }
      `}</style>

            <div style={{
                minHeight: "100vh", background: "transparent",
                fontFamily: "'DM Sans', sans-serif", color: t.text,
                display: "flex", flexDirection: "column", position: "relative",
                transition: "background 0.4s ease, color 0.3s ease, filter 0.4s ease",
                filter: logoutPhase !== "idle" ? "blur(8px)" : "none",
            }}>
                <style>{`
                body { overflow: ${showConfirm || showForm ? "hidden" : "auto"}; }
            `}</style>

                <Navbar user={user} activeTab={activeTab} onTabChange={handleTabChange}
                    onSignOut={() => setShowConfirm(true)} onSignIn={onSignIn}
                    theme={theme} themeColors={t} onToggleTheme={onToggleTheme} />

                {isGuest && (
                    <div style={{
                        margin: "0 auto", maxWidth: 1000, width: "100%", padding: "12px 36px 0",
                        animation: "guestBannerIn 0.4s ease both", position: "relative", zIndex: 1,
                    }}>
                        <div className="guest-banner" style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
                            padding: "14px 20px", borderRadius: 14,
                            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 20 }}>🔒</span>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa" }}>Read-Only Mode</div>
                                    <div style={{ fontSize: 12, color: t.textMuted }}>Sign in to add, edit, or delete transactions</div>
                                </div>
                            </div>
                            <button onClick={onSignIn} style={{
                                padding: "8px 18px", borderRadius: 9, border: "none",
                                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                            }}>Sign In →</button>
                        </div>
                    </div>
                )}

                <main className="dashboard-main">
                    <div style={{ animation: "fadeSlideIn 0.5s ease 0.1s both", marginBottom: 28 }}>
                        <div style={{ fontSize: 12, color: "#60a5fa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                            ✦ {activeTab === "dashboard" ? "Financial Overview" : "All Transactions"}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 34px)", fontWeight: 700, marginBottom: 4 }}>
                            {activeTab === "dashboard"
                                ? <>Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}<span style={{ color: "#3b82f6" }}>.</span></>
                                : <>Your Transactions<span style={{ color: "#3b82f6" }}>.</span></>}
                        </div>
                        <div style={{ fontSize: 13, color: t.textMuted }}>
                            {activeTab === "dashboard"
                                ? `${transactions.length} transactions${isGuest ? " · Demo data" : ""}`
                                : `${filtered.length} of ${transactions.length} entries shown`}
                        </div>
                    </div>

                    {activeTab === "dashboard" && (
                        <div style={{ marginBottom: 24 }}>
                            <SummaryCards transactions={transactions} theme={t} />
                            <SpendingCharts transactions={transactions} theme={t} />
                            {!isGuest && (
                                <div style={{ maxWidth: 340, marginTop: 24, animation: "fadeSlideIn 0.5s ease 0.6s both" }}>
                                    <StorageCard theme={t} onReset={handleReset} />
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginBottom: 18, animation: "fadeSlideIn 0.5s ease 0.3s both" }}>
                        <FilterBar filters={filters} onFilterChange={setFilters} theme={t} disabled={false} />
                    </div>

                    <div style={{ animation: "fadeSlideIn 0.5s ease 0.4s both" }}>
                        <TransactionList transactions={filtered} onEdit={handleEdit} onDelete={handleDelete} theme={t} readOnly={isGuest} />
                    </div>
                </main>

                {!isGuest && (
                    <button onClick={() => { setEditingTxn(null); setShowForm(true); }} style={{
                        position: "fixed", bottom: 48, right: 32, width: 58, height: 58, borderRadius: 16,
                        border: "none", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "white",
                        fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 40, animation: "fabPulse 2s ease-in-out infinite", transition: "transform 0.2s ease",
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
                    >+</button>
                )}

                {showForm && !isGuest && <TransactionForm editingTxn={editingTxn} onSave={handleSave} onClose={() => { setShowForm(false); setEditingTxn(null); }} theme={t} />}
            </div>

            {/* Confirm Logout Modal - Rendered OUTSIDE of blurred container */}
            {showConfirm && (
                <div style={{
                    position: "fixed", inset: 0, zMount: 500,
                    background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
                    display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 20px",
                    animation: "fadeIn 0.2s ease", zIndex: 500
                }}>
                    <div style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 24, width: "100%", maxWidth: 420, overflow: "hidden", animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
                        <div style={{ height: 4, background: "linear-gradient(90deg,#ef4444,#dc2626)" }} />
                        <div style={{ padding: "32px 28px", textAlign: "center" }}>
                            <div style={{ fontSize: 48, marginBottom: 18, animation: "iconWobble 2s ease-in-out infinite", display: "inline-block" }}>🚪</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 8 }}>Leaving already?</div>
                            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>Your session will be securely terminated. All data is saved.</div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: t.bgCard, border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Stay</button>
                                <button onClick={confirmLogout} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 24px rgba(239,68,68,0.3)" }}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Countdown Overlay - Rendered OUTSIDE of blurred container */}
            {(logoutPhase === "countdown" || logoutPhase === "bye") && (
                <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", padding: "120px 20px" }}>
                    <div style={{ position: "absolute", inset: 0, background: logoutPhase === "bye" ? "radial-gradient(ellipse at center,#0d1b2a,#000)" : "rgba(0,0,0,0.9)", backdropFilter: "blur(18px)", transition: "all 0.5s ease" }} />
                    {logoutPhase === "countdown" && (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                            {[0, 1, 2].map(i => <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 140, height: 140, borderRadius: "50%", border: "2px solid rgba(239,68,68,0.2)", transform: "translate(-50%,-50%)", animation: `ringExpand 1.2s ease ${i * 0.4}s infinite` }} />)}
                            <div key={countdown} style={{ fontSize: 120, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: "#ef4444", lineHeight: 1, animation: "countDown 0.7s cubic-bezier(0.22,1,0.36,1) both", textShadow: "0 0 60px rgba(239,68,68,0.4)" }}>{countdown}</div>
                            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 24, letterSpacing: 2 }}>{countdown === 3 ? "SAVING..." : countdown === 2 ? "SECURE..." : "DONE"}</div>
                        </div>
                    )}
                    {logoutPhase === "bye" && (
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "byeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                            <div style={{ fontSize: 72, marginBottom: 20, animation: "byeFloat 2s ease-in-out infinite", display: "inline-block" }}>👋</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>See you soon<span style={{ color: "#3b82f6" }}>.</span></div>
                            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Your session safe & secure</div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
