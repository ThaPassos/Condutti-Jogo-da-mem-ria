import { useEffect, useState } from "react";

const COLORS = ["#0b5e44", "#10b981", "#fbbf24", "#f5f2f2", "#34d399"];

export default function Confetti({ count = 60 }: { count?: number }) {
  const [pieces, setPieces] = useState<
    Array<{ id: number; left: number; delay: number; duration: number; color: string; size: number }>
  >([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.6}px`,
            background: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
}
