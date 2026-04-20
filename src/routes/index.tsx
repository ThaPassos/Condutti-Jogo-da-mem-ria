import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { sounds } from "../lib/sounds";
import BotaoSom from "../components/BotaoSom";
import AnimatedLines from "../components/LinhasAnimadas";
import logoCondutti from "../assets/logo-condutti.png";

// Padrão fixo de QR para evitar re-render e erro de lint com Math.random no JSX
const QR_PATTERN = Array.from({ length: 64 }, (_, i) =>
  // padrão pseudo-aleatório baseado no índice
  ((i * 2654435761) >>> 0) % 2 === 0
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BotaoSom />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklab, var(--accent) 20%, transparent), transparent 60%)",
        }}
      />

      <AnimatedLines />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="animate-float-up flex flex-col items-center">
          <img
            src={logoCondutti}
            alt="Condutti Cabos Especiais"
            className="h-auto w-56 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:w-72"
          />
        </div>

        <div className="h-px w-4/5 bg-border" />

        <h1 className="animate-title text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          JOGO DA <span className="text-accent">MEMÓRIA</span>
        </h1>
        <p className="text-base text-foreground/80 sm:text-xl">Encontre os pares e vença!</p>

        <Link
          to="/jogo"
          onClick={() => sounds.click()}
          className="group mt-4 inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 hover:bg-accent active:translate-y-1 active:shadow-btn-active sm:px-14 sm:py-5 sm:text-2xl"
        >
          <Play className="h-5 w-5 fill-current transition-transform group-hover:translate-x-0.5 sm:h-6 sm:w-6" />
          JOGAR
        </Link>

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href="https://condutti.com.br/"
            target="_blank"
            rel="noreferrer"
            className="grid h-32 w-32 place-items-center rounded-2xl bg-card-back-bg p-3 shadow-card transition-transform hover:scale-105"
          >
            <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-px">
              {QR_PATTERN.map((filled, i) => (
                <div
                  key={i}
                  className="rounded-[1px]"
                  style={{ background: filled ? "#0a0a0a" : "transparent" }}
                />
              ))}
            </div>
          </a>
          <p className="text-sm text-foreground/80">Visite o nosso site!</p>
        </div>
      </div>
    </div>
  );
}
