import { useState } from "react";

export default function MemoryCard({
  flipped,
  matched,
  wrong,
  onClick,
  frontImage,
  backImage,
}: {
  flipped: boolean;
  matched: boolean;
  wrong: boolean;
  onClick: () => void;
  frontImage: string;
  backImage: string;
}) {
  const [hover, setHover] = useState(false);
  const showFlipped = flipped || matched;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={matched}
      className={
        "card-3d aspect-[3/4] w-full cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-ring " +
        (matched ? "animate-glow" : "")
      }
      style={{ borderRadius: "var(--card-radius)" }}
    >
      <div
        className={
          "card-inner " +
          (showFlipped ? "flipped " : "") +
          (wrong ? "animate-shake " : "") +
          (hover && !showFlipped ? "scale-[1.04] " : "")
        }
        style={{ transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
      >
        {/* Frente: verso da carta (oculta a imagem) */}
        <div
          className="card-face shadow-card"
          style={{
            background:
              "linear-gradient(135deg, var(--card-front-bg), color-mix(in oklab, var(--card-front-bg) 70%, black))",
          }}
        >
          <img src={frontImage} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Verso: imagem do par */}
        <div
          className="card-face card-face-back shadow-card"
          style={{ background: "var(--card-back-bg)" }}
        >
          <img src={backImage} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </button>
  );
}