import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/transactionStore";

// ─── Transaction Form Modal (₹, responsive) ──────────────────────────────────
export default function TransactionForm({ editingTxn, onSave, onClose, theme: t }) {
    const [form, setForm] = useState({
        title: "", amount: "", type: "expense", category: "Other",
        date: new Date().toISOString().split("T")[0],
    });
    const [focus, setFocus] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingTxn) {
            setForm({ title: editingTxn.title, amount: String(editingTxn.amount), type: editingTxn.type, category: editingTxn.category, date: editingTxn.date });
        }
    }, [editingTxn]);

    const handleSubmit = () => {
        if (!form.title.trim()) { setError("Please enter a title."); return; }
        if (!form.amount || Number(form.amount) <= 0) { setError("Please enter a valid amount."); return; }
        if (!form.date) { setError("Please select a date."); return; }
        setError(""); setSaving(true);
        setTimeout(() => {
            onSave({ ...form, amount: Number(form.amount), ...(editingTxn ? { id: editingTxn.id } : {}) });
            setSaving(false);
        }, 400);
    };

    const inputStyle = (field) => ({
        width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14, outline: "none",
        background: focus === field ? t.bgInputFocus : t.bgInput,
        border: `1px solid ${focus === field ? t.borderFocus : t.border}`,
        color: t.text, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
        boxShadow: focus === field ? "0 0 0 3px rgba(59,130,246,0.08)" : "none",
    });

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-start",
            overflowY: "auto", padding: "60px 20px",
            animation: "fadeIn 0.2s ease",
        }}>
            <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes modalPop{from{transform:scale(0.92) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        .form-modal { width: 100%; max-width: 460px; }
        @media (max-width: 500px) { .form-modal { max-width: 100%; margin: 0 8px; } }
        button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        button:hover { 
            transform: translateY(-2px); 
            filter: brightness(1.1);
        }
        button:active { transform: translateY(0) scale(0.98); }
        .type-btn:hover { border-color: rgba(16,185,129,0.6) !important; background: rgba(16,185,129,0.1) !important; }
        .close-btn:hover { background: rgba(255,255,255,0.1) !important; transform: rotate(90deg); }
      `}</style>

            <div onClick={e => e.stopPropagation()} className="form-modal" style={{
                background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 22,
                animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)", overflow: "hidden",
            }}>
                <div style={{ height: 4, background: editingTxn ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, #3b82f6, #1d4ed8)" }} />
                <div style={{ padding: "28px 26px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: t.text }}>
                                {editingTxn ? "Edit Transaction" : "New Transaction"}
                            </div>
                            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>
                                {editingTxn ? "Update the details below" : "Fill in the details to add a record"}
                            </div>
                        </div>
                        <button onClick={onClose} className="close-btn" style={{ width: 34, height: 34, borderRadius: 10, background: t.bgInput, border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>✕</button>
                    </div>

                    {/* Type toggle */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                        {[{ id: "income", label: "Income", icon: "📈", color: "#10b981" }, { id: "expense", label: "Expense", icon: "📉", color: "#ef4444" }].map(tp => (
                            <button key={tp.id} onClick={() => setForm({ ...form, type: tp.id })} className="type-btn" style={{
                                flex: 1, padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
                                background: form.type === tp.id ? `${tp.color}18` : t.bgInput,
                                border: `1px solid ${form.type === tp.id ? `${tp.color}40` : t.border}`,
                                color: form.type === tp.id ? tp.color : t.textMuted,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                            }}><span>{tp.icon}</span> {tp.label}</button>
                        ))}
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: t.labelColor, marginBottom: 6 }}>Title</label>
                        <input style={inputStyle("title")} type="text" placeholder="e.g. Salary, Groceries..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onFocus={() => setFocus("title")} onBlur={() => setFocus(null)} />
                    </div>

                    {/* Amount + Date */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: t.labelColor, marginBottom: 6 }}>Amount (₹)</label>
                            <input style={inputStyle("amount")} type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} onFocus={() => setFocus("amount")} onBlur={() => setFocus(null)} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: t.labelColor, marginBottom: 6 }}>Date</label>
                            <input style={{ ...inputStyle("date"), colorScheme: "dark" }} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} onFocus={() => setFocus("date")} onBlur={() => setFocus(null)} />
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: t.labelColor, marginBottom: 6 }}>Category</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle("_"), cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
                            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: t.selectBg }}>{c}</option>)}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "center", gap: 7 }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 11, background: t.bgInput, border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                        <button onClick={handleSubmit} disabled={saving} style={{
                            flex: 1, padding: "13px", borderRadius: 11, border: "none",
                            background: editingTxn ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                            color: "white", fontSize: 14, fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
                            boxShadow: editingTxn ? "0 6px 20px rgba(245,158,11,0.3)" : "0 6px 20px rgba(59,130,246,0.3)",
                            transition: "all 0.2s ease", transform: saving ? "scale(0.97)" : "scale(1)",
                        }}>{saving ? "Saving..." : editingTxn ? "Update Transaction" : "Add Transaction →"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
