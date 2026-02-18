import { useState, useEffect, useCallback } from "react";

// ─── Theme System ─────────────────────────────────────────────────────────────
const THEME_KEY = "fintrak_theme";

export function useTheme() {
    const [theme, setThemeState] = useState(() => {
        try {
            return localStorage.getItem(THEME_KEY) || "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((t) => (t === "dark" ? "light" : "dark"));
    }, []);

    return { theme, toggleTheme };
}

// Theme color tokens
export const themes = {
    dark: {
        bg: "radial-gradient(ellipse at 20% 50%, #061a15 0%, #030a08 50%, #000 100%)", // Midnight Emerald
        bgSolid: "#030a08",
        bgCard: "rgba(255,255,255,0.03)",
        bgCardHover: "rgba(16,185,129,0.05)", // Emerald glow
        bgInput: "rgba(0,0,0,0.2)",
        bgInputFocus: "rgba(16,185,129,0.1)",
        border: "rgba(16,185,129,0.15)", // Emerald border
        borderLight: "rgba(16,185,129,0.05)",
        borderFocus: "rgba(16,185,129,0.6)",
        text: "#e0f2f1", // Minty white
        textSecondary: "#99f6e4",
        textMuted: "rgba(153,246,228,0.6)",
        textFaint: "rgba(153,246,228,0.4)",
        labelColor: "rgba(16,185,129,0.7)",
        navBg: "rgba(3,10,8,0.95)",
        modalBg: "linear-gradient(145deg, #061a14, #020806)",
        selectBg: "#061a14",
    },
    light: {
        bg: "linear-gradient(120deg, #f0f9ff 0%, #ecfdf5 40%, #fefce8 70%, #fff7ed 100%)", // Crystal Prism
        bgSolid: "#f0f9ff",
        bgCard: "rgba(255,255,255,0.8)",
        bgCardHover: "rgba(16,185,129,0.08)",
        bgInput: "rgba(0,0,0,0.03)",
        bgInputFocus: "rgba(16,185,129,0.06)",
        border: "rgba(16,185,129,0.15)",
        borderLight: "rgba(16,185,129,0.05)",
        borderFocus: "rgba(16,185,129,0.5)",
        text: "#064e3b", // Deep emerald
        textSecondary: "#065f46",
        textMuted: "rgba(6,95,70,0.7)",
        textFaint: "rgba(6,95,70,0.45)",
        labelColor: "rgba(6,95,70,0.65)",
        navBg: "rgba(255,255,255,0.9)",
        modalBg: "linear-gradient(145deg, #ffffff, #f0fff4)",
        selectBg: "#ffffff",
    },
};
