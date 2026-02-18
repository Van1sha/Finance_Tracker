import { useState, useEffect } from "react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
export default function Counter({ end, suffix = "", duration = 1800 }) {
    const [val, setVal] = useState(0);

    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration]);

    return (
        <span>
            {val.toLocaleString()}
            {suffix}
        </span>
    );
}
