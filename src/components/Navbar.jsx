import { useState } from "react";
import logo from "../assets/logo.png";

// ─── Navbar (responsive, guest-aware) ─────────────────────────────────────────
export default function Navbar({ user, activeTab, onTabChange, onSignOut, onSignIn, theme, themeColors: t, onToggleTheme }) {
    const [hoveredTab, setHoveredTab] = useState(null);
    const isGuest = !user;

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "transactions", label: "Transactions", icon: "💳" },
        ...(!isGuest ? [{ id: "add", label: "Add New", icon: "➕" }] : []),
    ];

    return (
        <>
            <style>{`
        .nav-bar { padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-tabs { display: flex; gap: 4px; }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-user-info { display: flex; align-items: center; gap: 9px; }
        .nav-user-text { display: block; }
        .nav-tab-label { display: inline; }
        
        .brand-text {
            background: linear-gradient(to right, #10b981 20%, #34d399 40%, #c084fc 60%, #34d399 80%, #10b981 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 4s linear infinite;
            font-family: 'Outfit', sans-serif;
            letter-spacing: -0.5px;
            font-weight: 800;
        }

        @keyframes shine {
            to { background-position: 200% center; }
        }

        .logo-animate {
            animation: floatLogo 3s ease-in-out infinite;
        }
        @keyframes floatLogo {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(3deg); }
        }

        @media (max-width: 768px) {
          .nav-bar { padding: 0 14px; height: 56px; }
          .nav-user-text { display: none; }
          .nav-tab-label { display: none; }
          .nav-right { gap: 8px; }
        }
        @media (max-width: 480px) {
          .nav-tabs { gap: 2px; }
        }

        /* Hover effects for interactive elements */
        button, .nav-tabs div, .theme-switch {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        button:hover { 
            transform: translateY(-2px); 
            filter: brightness(1.1);
        }
        button:active { 
            transform: translateY(0) scale(0.98); 
        }
        .nav-tabs div:hover { 
            background: rgba(16,185,129,0.1) !important; 
            transform: scale(1.02);
        }
        .theme-switch:hover {
            transform: scale(1.05);
            background: rgba(16,185,129,0.2) !important;
        }

        /* Modern Toggle Switch Styles */
        .theme-switch {
            width: 64px; height: 32px; border-radius: 100px; padding: 4px;
            cursor: pointer; position: relative; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(0,0,0,0.2); border: 1px solid rgba(16,185,129,0.2);
            display: flex; align-items: center;
        }
        .theme-switch-handle {
            width: 24px; height: 24px; border-radius: 50%;
            background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex; align-items: center; justifyContent: center;
            font-size: 14px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: absolute; left: 4px;
        }
        .theme-switch.dark { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.4); }
        .theme-switch.dark .theme-switch-handle { left: 34px; background: #064e3b; color: #10b981; }
        .theme-switch.light .theme-switch-handle { background: #facc15; }
      `}</style>
            <nav className="nav-bar" style={{
                borderBottom: `1px solid ${t.border}`,
                background: t.navBg,
                backdropFilter: "blur(24px)",
                position: "sticky", top: 0, zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onTabChange("dashboard")}>
                    <img src={logo} alt="FinTrack logo" className="logo-animate" style={{
                        width: 44, height: 44, objectFit: "contain",
                        filter: "drop-shadow(0 8px 16px rgba(16,185,129,0.3))"
                    }} />
                    <span className="brand-text" style={{ fontSize: 26 }}>
                        Fin<span style={{ fontWeight: 400 }}>Track</span>
                        <span style={{ color: "#c084fc", marginLeft: 1 }}>.</span>
                    </span>
                </div>

                {/* Nav Tabs */}
                <div className="nav-tabs" style={{ background: t.bgInput, borderRadius: 14, padding: 4, border: `1px solid ${t.border}` }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => onTabChange(tab.id)}
                            onMouseEnter={() => setHoveredTab(tab.id)} onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                padding: "8px 20px", borderRadius: 11, border: "none", cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                                display: "flex", alignItems: "center", gap: 8,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                background: activeTab === tab.id ? "rgba(16,185,129,0.15)" : hoveredTab === tab.id ? t.bgCardHover : "transparent",
                                color: activeTab === tab.id ? "#10b981" : t.textMuted,
                                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(16,185,129,0.1)" : "none",
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{tab.icon}</span>
                            <span className="nav-tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div className="nav-right">
                    {/* Theme Toggle */}
                    {/* Modern Theme Toggle Switch */}
                    <div onClick={onToggleTheme} className={`theme-switch ${theme}`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                        <div className="theme-switch-handle">
                            {theme === "dark" ? "🌙" : "☀️"}
                        </div>
                    </div>

                    {isGuest ? (
                        /* Guest: Sign In button */
                        <button onClick={onSignIn} style={{
                            padding: "10px 22px", borderRadius: 12,
                            border: "none", background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: "0 8px 20px rgba(16,185,129,0.3)",
                            display: "flex", alignItems: "center", gap: 8,
                            transition: "all 0.3s ease",
                        }}>🔑 Sign In</button>
                    ) : (
                        <>
                            {/* User info */}
                            <div className="nav-user-info">
                                <div style={{
                                    width: 38, height: 38, borderRadius: 12,
                                    background: "linear-gradient(135deg,#10b981,#059669)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 700, color: "white",
                                    border: "2px solid rgba(16,185,129,0.3)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                }}>{user.avatar}</div>
                                <div className="nav-user-text">
                                    <div style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 1 }}>{user.name}</div>
                                    <div style={{ fontSize: 11, color: t.textMuted }}>{user.email}</div>
                                </div>
                            </div>
                            {/* Sign Out */}
                            <button onClick={onSignOut} style={{
                                padding: "10px 16px", borderRadius: 11,
                                border: `1px solid ${t.border}`, background: "rgba(251,191,36,0.06)",
                                color: "#fbbf24", fontSize: 13, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease",
                                display: "flex", alignItems: "center", gap: 8,
                            }}>🚪 <span className="nav-tab-label">Leave</span></button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}
