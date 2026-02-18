import { useEffect, useRef } from "react";

// ─── Money-Themed Animated Background ─────────────────────────────────────────
// Floating ₹ symbols, coins, and banknote shapes drift across the canvas
export default function AnimatedBackground({ theme, showGif }) {
    const ref = useRef(null);
    const animRef = useRef(null);
    const isDark = theme === "dark";

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

        // Money symbols pool - Focus on precisely requested emojis
        const symbols = ["💎", "💰", "🪙", "💸", "💴"];

        // Create floating items
        const itemCount = showGif ? 110 : 45; // Slightly more items for better coverage
        const items = Array.from({ length: itemCount }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: showGif ? (Math.random() - 0.5) * 1.6 : (Math.random() - 0.5) * 0.35,
            vy: showGif ? (Math.random() * 1.2 + 0.6) : -(Math.random() * 0.2 + 0.1), // Very slow float/fall
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            size: showGif ? Math.random() * 28 + 18 : Math.random() * 20 + 14,
            alpha: showGif ? Math.random() * 0.25 + 0.15 : Math.random() * 0.18 + 0.08, // Increased visibility
            rotation: Math.random() * 360,
            rotSpeed: showGif ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.6,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: showGif ? Math.random() * 0.04 + 0.015 : Math.random() * 0.015 + 0.005,
            wobbleAmp: showGif ? Math.random() * 70 + 30 : Math.random() * 25 + 8,
        }));

        // Particles (small dots like sparkling coins)
        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.3 + 0.05,
            hue: [45, 50, 55, 140, 200, 210][Math.floor(Math.random() * 6)], // gold/green/blue tones
            pulse: Math.random() * Math.PI * 2,
        }));

        // Large drifting blobs ("Moving Objects")
        const blobs = Array.from({ length: 6 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 100 + 100,
            alpha: Math.random() * 0.04 + 0.02,
            hue: [210, 220, 240, 260][Math.floor(Math.random() * 4)], // blue/purple tones
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const lineAlpha = (1 - d / 100) * (isDark ? 0.06 : 0.04);
                        ctx.strokeStyle = isDark
                            ? `rgba(100,180,255,${lineAlpha})`
                            : `rgba(59,130,246,${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw large blobs
            blobs.forEach((b) => {
                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                grad.addColorStop(0, isDark ? `hsla(${b.hue}, 60%, 50%, ${b.alpha})` : `hsla(${b.hue}, 60%, 80%, ${b.alpha})`);
                grad.addColorStop(1, "transparent");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();

                b.x += b.vx;
                b.y += b.vy;
                if (b.x < -b.r) b.x = W + b.r;
                if (b.x > W + b.r) b.x = -b.r;
                if (b.y < -b.r) b.y = H + b.r;
                if (b.y > H + b.r) b.y = -b.r;
            });

            // Draw particles
            particles.forEach((p) => {
                p.pulse += 0.02;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                const pAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.fillStyle = isDark
                    ? `hsla(${p.hue},70%,65%,${pAlpha})`
                    : `hsla(${p.hue},60%,45%,${pAlpha * 0.6})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            });

            // Draw floating money symbols
            items.forEach((item) => {
                item.wobble += item.wobbleSpeed;
                const wx = Math.sin(item.wobble) * item.wobbleAmp;

                ctx.save();
                ctx.translate(item.x + wx, item.y);
                ctx.rotate((item.rotation * Math.PI) / 180);
                ctx.globalAlpha = item.alpha;
                ctx.font = `${item.size}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // For ₹ text, use a styled rendering
                if (item.symbol === "₹") {
                    ctx.font = `bold ${item.size}px 'DM Sans', sans-serif`;
                    ctx.fillStyle = isDark
                        ? `rgba(59,130,246,${item.alpha * 4})`
                        : `rgba(59,130,246,${item.alpha * 3})`;
                    ctx.fillText("₹", 0, 0);
                } else {
                    ctx.fillText(item.symbol, 0, 0);
                }

                ctx.restore();

                // Update position
                item.x += item.vx;
                item.y += item.vy;
                item.rotation += item.rotSpeed;

                // Wrap around
                if (showGif) {
                    // Rain mode wrap: from bottom/side back to top
                    if (item.y > H + 40) {
                        item.y = -40;
                        item.x = Math.random() * W;
                    }
                    if (item.x < -40) item.x = W + 40;
                    if (item.x > W + 40) item.x = -40;
                } else {
                    // Drift mode wrap: from top back to bottom
                    if (item.y < -40) {
                        item.y = H + 40;
                        item.x = Math.random() * W;
                    }
                    if (item.x < -40) item.x = W + 40;
                    if (item.x > W + 40) item.x = -40;
                }
            });

            animRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [isDark, showGif]);

    return (
        <>
            {/* Animated Mesh Gradient Background Layer */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: -2,
                background: isDark
                    ? "linear-gradient(45deg, #020617 0%, #064e3b 50%, #020617 100%)"
                    : "linear-gradient(120deg, #e0f2fe 0%, #ecfdf5 30%, #fef9c3 65%, #ffedd5 100%)",
                overflow: "hidden",
                pointerEvents: "none",
            }}>
                <div className="gradient-flow" style={{
                    position: "absolute",
                    inset: "-50%",
                    width: "200%",
                    height: "200%",
                    background: isDark
                        ? `radial-gradient(circle at 20% 30%, rgba(16,185,129,0.1) 0%, transparent 40%),
                           radial-gradient(circle at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 40%),
                           radial-gradient(circle at 40% 80%, rgba(139,92,246,0.08) 0%, transparent 40%),
                           radial-gradient(circle at 70% 70%, rgba(245,158,11,0.04) 0%, transparent 40%)`
                        : `radial-gradient(circle at 20% 30%, rgba(16,185,129,0.06) 0%, transparent 40%),
                           radial-gradient(circle at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 40%),
                           radial-gradient(circle at 40% 80%, rgba(139,92,246,0.04) 0%, transparent 40%)`,
                    filter: "blur(90px)",
                    animation: "rotateMesh 30s linear infinite",
                    opacity: 0.5,
                }} />
            </div>
            <style>{`
                @keyframes rotateMesh {
                    from { transform: rotate(0deg) scale(1.1); }
                    to { transform: rotate(360deg) scale(1.2); }
                }
                .gradient-flow {
                    background-size: 200% 200%;
                }
            `}</style>
            <canvas
                ref={ref}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    opacity: isDark ? 0.4 : 0.25,
                    pointerEvents: "none",
                }}
            />
            {showGif && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    backgroundImage: `url('https://media.giphy.com/media/LdOyjZ7TC5K3Lghio4/giphy.gif')`, // Money rain fallback
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isDark ? 0.15 : 0.08,
                    pointerEvents: "none",
                    animation: "fadeInBackground 0.5s ease both"
                }}>
                    <style>{`@keyframes fadeInBackground{from{opacity:0}to{opacity:${isDark ? 0.15 : 0.08}}}`}</style>
                </div>
            )}
        </>
    );
}
