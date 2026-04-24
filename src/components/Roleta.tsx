import { useState, useRef, useEffect } from "react";
import { Gift } from "lucide-react";
import { sounds } from "../lib/sounds";

const PRIZES = [
  { label: "Boné",   colorVar: "--accent" },
  { label: "Caneta", colorVar: "--primary" },
  { label: "Cordão", colorVar: "--success" },
  { label: "Ecobag", colorVar: "--destructive" },
];

const SEGMENTS = Array.from({ length: 3 }, () => PRIZES).flat();

const CANVAS_SIZE = 320; // era 224

export default function PrizeWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const angleRef = useRef(0);
  const colorsRef = useRef<string[]>([]);

  const SEG_ANGLE = (2 * Math.PI) / SEGMENTS.length;

  function resolveColors() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    colorsRef.current = PRIZES.map((p) =>
      style.getPropertyValue(p.colorVar).trim()
    );
  }

  function drawWheel(angle: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SEGMENTS.forEach((seg, i) => {
      const start = angle + i * SEG_ANGLE;
      const end = start + SEG_ANGLE;
      const prizeIdx = i % PRIZES.length;
      const color = colorsRef.current[prizeIdx] || "#888";

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + SEG_ANGLE / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(canvas.width * 0.044)}px sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 3;
      ctx.fillText(seg.label, radius - 14, 4);
      ctx.restore();
    });

    // Borda branca externa
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  useEffect(() => {
    resolveColors();
    drawWheel(0);
  }, []);

  function spin() {
    if (spinning) return;
    sounds.click();
    setWinner(null);
    setSpinning(true);

    const winnerIdx = Math.floor(Math.random() * SEGMENTS.length);
    const targetCenter = winnerIdx * SEG_ANGLE + SEG_ANGLE / 2;
    const targetAngle = -Math.PI / 2 - targetCenter;
    const totalSpins = 6 * 2 * Math.PI;
    const startAngle = angleRef.current;
    const finalAngle =
      startAngle - (startAngle % (2 * Math.PI)) + totalSpins + targetAngle;

    const duration = 4200;
    const startTime = performance.now();

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 4);
    }

    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const angle = startAngle + (finalAngle - startAngle) * easeOut(t);
      angleRef.current = angle;
      drawWheel(angle);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        setWinner(SEGMENTS[winnerIdx].label);
        sounds.match();
      }
    }
    requestAnimationFrame(frame);
  }

  const centerBtnSize = Math.round(CANVAS_SIZE * 0.19); // ~60px em 320

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-black uppercase tracking-widest text-accent sm:text-xl">
        Gire e ganhe um brinde!
      </h3>

      <div
        className="relative"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      >
        {/* Ponteiro */}
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "26px solid var(--foreground)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        />

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-full"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />

        {/* Centro clicável */}
        <button
          onClick={spin}
          disabled={spinning}
          aria-label="Girar roleta"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-secondary shadow-card transition-transform active:scale-90 disabled:cursor-not-allowed"
          style={{
            width: centerBtnSize,
            height: centerBtnSize,
            border: "3px solid color-mix(in oklab, var(--accent) 60%, transparent)",
          }}
        >
          <Gift className="h-7 w-7 text-accent" />
        </button>
      </div>

      {winner ? (
        <div className="animate-pop rounded-full bg-accent px-6 py-2 text-base font-black text-accent-foreground shadow-card sm:text-lg">
          Você ganhou: {winner}!
        </div>
      ) : null}
    </div>
  );
}