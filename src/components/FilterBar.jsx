import { useState } from "react";
import { CATEGORIES } from "../utils/transactionStore";

// ─── Filter Bar (responsive) ─────────────────────────────────────────────────
export default function FilterBar({ filters, onFilterChange, theme: t, disabled }) {
    const [focusSearch, setFocusSearch] = useState(false);

    const selectStyle = {
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13,
        outline: "none",
        background: t.bgInput,
        border: `1px solid ${t.border}`,
        color: t.text,
        fontFamily: "'DM Sans', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        minWidth: 0,
        flex: "1 1 120px",
        opacity: disabled ? 0.5 : 1,
    };

    return (
        <>
            <style>{`
        .filter-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .filter-search { flex: 1; min-width: 200px; }
        @media (max-width: 640px) {
          .filter-bar { flex-direction: column; }
          .filter-search { min-width: 100%; }
          .filter-bar select { width: 100%; }
        }
      `}</style>
            <div className="filter-bar" style={{
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: 14,
                padding: "14px 18px",
                backdropFilter: "blur(12px)",
            }}>
                <div className="filter-search" style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                        onFocus={() => setFocusSearch(true)}
                        onBlur={() => setFocusSearch(false)}
                        disabled={disabled}
                        style={{
                            width: "100%",
                            padding: "10px 14px 10px 38px",
                            borderRadius: 10,
                            fontSize: 13,
                            outline: "none",
                            background: focusSearch ? t.bgInputFocus : t.bgInput,
                            border: `1px solid ${focusSearch ? t.borderFocus : t.border}`,
                            color: t.text,
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.2s ease",
                            boxShadow: focusSearch ? "0 0 0 3px rgba(59,130,246,0.08)" : "none",
                            opacity: disabled ? 0.5 : 1,
                            cursor: disabled ? "not-allowed" : "text",
                        }}
                    />
                </div>

                <select value={filters.type} onChange={e => onFilterChange({ ...filters, type: e.target.value })} style={selectStyle} disabled={disabled}>
                    <option value="all" style={{ background: t.selectBg }}>All Types</option>
                    <option value="income" style={{ background: t.selectBg }}>💰 Income</option>
                    <option value="expense" style={{ background: t.selectBg }}>💸 Expense</option>
                </select>

                <select value={filters.category} onChange={e => onFilterChange({ ...filters, category: e.target.value })} style={selectStyle} disabled={disabled}>
                    <option value="all" style={{ background: t.selectBg }}>All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: t.selectBg }}>{c}</option>)}
                </select>

                <select value={filters.sort} onChange={e => onFilterChange({ ...filters, sort: e.target.value })} style={selectStyle} disabled={disabled}>
                    <option value="newest" style={{ background: t.selectBg }}>Newest First</option>
                    <option value="oldest" style={{ background: t.selectBg }}>Oldest First</option>
                    <option value="highest" style={{ background: t.selectBg }}>Highest Amount</option>
                    <option value="lowest" style={{ background: t.selectBg }}>Lowest Amount</option>
                </select>
            </div>
        </>
    );
}
