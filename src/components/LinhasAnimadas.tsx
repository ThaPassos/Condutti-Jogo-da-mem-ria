export default function AnimatedLines() {
  const lines = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes diag-slide {
          0%   { transform: translate(-70vw, 70vh) rotate(-35deg); opacity: 0; }
          20%  { opacity: var(--line-opacity, 0.4); }
          80%  { opacity: var(--line-opacity, 0.4); }
          100% { transform: translate(70vw, -70vh) rotate(-35deg); opacity: 0; }
        }
        @keyframes blob-float {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,-20px) scale(1.1); }
        }
      `}</style>

      {/* Manchas suaves de fundo */}
      <div
        className="absolute -left-32 top-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--accent) 35%, transparent)",
          animation: "blob-float 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--success) 25%, transparent)",
          animation: "blob-float 11s ease-in-out infinite reverse",
        }}
      />

      {/* Linhas diagonais */}
      {lines.map((i) => {
        const top = ((i * 11 + 10) % 130) - 15;
        const duration = 5 + (i % 5) * 1.2;
        const delay = (i * 0.4) % 5;
        const thickness = i % 4 === 0 ? 3 : 1;
        const opacity = i % 4 === 0 ? 0.55 : 0.25;
        const useAccent = i % 2 === 0;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: "140vmax",
              height: `${thickness}px`,
              marginLeft: "-70vmax",
              marginTop: `${top - 50}vh`,
              background: `linear-gradient(90deg, transparent, ${
                useAccent ? "var(--accent)" : "var(--success)"
              }, transparent)`,
              animation: `diag-slide ${duration}s cubic-bezier(0.45, 0, 0.55, 1) ${delay}s infinite`,
              ["--line-opacity" as string]: String(opacity),
            }}
          />
        );
      })}
    </div>
  );
}
