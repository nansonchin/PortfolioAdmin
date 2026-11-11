const TICKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const r2 = i % 4 === 0 ? 74 : 70;
  const f = (n: number) => n.toFixed(2);
  return {
    x1: f(80 + 66 * Math.cos(a)),
    y1: f(80 + 66 * Math.sin(a)),
    x2: f(80 + r2 * Math.cos(a)),
    y2: f(80 + r2 * Math.sin(a)),
  };
});

/**
 * Decorative ring: tick ring turning one way, hexagon turning the other,
 * a pulsing core and one small amber dot orbiting on the ring.
 */
export default function HexRing({ size = 84, className = "" }: { size?: number; className?: string }) {
  const spin = (name: string, s: number): React.CSSProperties => ({
    transformOrigin: "80px 80px",
    animation: `${name} ${s}s linear infinite`,
  });

  return (
    <>
      <style>{`
        @keyframes hexring-cw { to { transform: rotate(360deg); } }
        @keyframes hexring-ccw { to { transform: rotate(-360deg); } }
        @keyframes hexring-pulse { 0%,100% { opacity: .25; } 50% { opacity: .8; } }
        @media (prefers-reduced-motion: reduce) { .hexring * { animation: none !important; } }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        aria-hidden
        className={`hexring text-ice ${className}`}
      >
        <g style={spin("hexring-cw", 26)}>
          {TICKS.map((t, i) => (
            <line key={i} {...t} stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          ))}
          <circle cx="80" cy="4" r="3.5" fill="#edc47d" />
        </g>
        <g style={spin("hexring-ccw", 18)}>
          <polygon points="80,34 120,57 120,103 80,126 40,103 40,57" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <polygon points="80,50 106,65 106,95 80,110 54,95 54,65" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
        </g>
        <polygon
          points="80,66 92,73 92,87 80,94 68,87 68,73"
          fill="currentColor"
          style={{ animation: "hexring-pulse 2.4s ease-in-out infinite" }}
        />
      </svg>
    </>
  );
}
