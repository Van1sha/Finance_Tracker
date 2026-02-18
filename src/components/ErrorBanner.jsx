// ─── Smart Error Banner ───────────────────────────────────────────────────────
export default function ErrorBanner({ message, actionLabel, onAction }) {
    return (
        <div
            style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 16,
                animation: "errorIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.5 }}>
                        {message}
                    </div>
                    {actionLabel && onAction && (
                        <button
                            onClick={onAction}
                            style={{
                                marginTop: 8,
                                padding: "5px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                background: "rgba(239,68,68,0.15)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                color: "#fca5a5",
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {actionLabel} →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
