import { useEffect, useRef } from "react";

// ─── Particle Canvas ──────────────────────────────────────────────────────────
export default function ParticleCanvas() {
    const ref = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let W = (canvas.width = window.innerWidth);
        let H = (canvas.height = window.innerHeight);
        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        const pts = Array.from({ length: 75 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.4 + 0.3,
            alpha: Math.random() * 0.45 + 0.1,
            hue: 200 + Math.random() * 60,
            pulse: Math.random() * Math.PI * 2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x,
                        dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(100,160,255,${(1 - d / 110) * 0.07})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            pts.forEach((p) => {
                p.pulse += 0.02;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha * (0.7 + 0.3 * Math.sin(p.pulse))})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            });
            animRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.55 }}
        />
    );
}
