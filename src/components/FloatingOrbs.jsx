// ─── Floating Orbs ────────────────────────────────────────────────────────────
export default function FloatingOrbs() {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            {[
                { size: 600, x: -10, y: -10, color: "rgba(59,130,246,0.06)", dur: 20 },
                { size: 500, x: 60, y: 70, color: "rgba(16,185,129,0.05)", dur: 25 },
                { size: 400, x: 80, y: 10, color: "rgba(139,92,246,0.07)", dur: 18 },
                { size: 350, x: 20, y: 80, color: "rgba(245,158,11,0.04)", dur: 30 },
            ].map((o, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        width: o.size,
                        height: o.size,
                        left: `${o.x}%`,
                        top: `${o.y}%`,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
                        transform: "translate(-50%,-50%)",
                        animation: `orb${i} ${o.dur}s ease-in-out infinite alternate`,
                    }}
                />
            ))}
            <style>{`
        @keyframes orb0{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-40%,-60%) scale(1.2)}}
        @keyframes orb1{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-60%,-40%) scale(0.9)}}
        @keyframes orb2{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-40%,-55%) scale(1.15)}}
        @keyframes orb3{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-55%,-45%) scale(1.1)}}
      `}</style>
        </div>
    );
}
