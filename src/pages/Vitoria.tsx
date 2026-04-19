import { Link, useSearchParams } from "react-router-dom";
import { Trophy, Clock, Crown, Home as HomeIcon } from "lucide-react";
import Confetes from "../components/Confetes";
import BotãoSom from "../components/BotaoSom";
import { formatTime } from "../lib/record";
import { sounds } from "../lib/sounds";

export default function Win() {
  const [params] = useSearchParams();
  const time = Number(params.get("time")) || 0;
  const record = Number(params.get("record")) || 0;
  const newRecord = Number(params.get("isNew")) === 1;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BotãoSom />
      <Confetes count={80} />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--success) 25%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="animate-float-up grid h-24 w-24 place-items-center rounded-full bg-accent shadow-card sm:h-32 sm:w-32">
          <Trophy className="h-12 w-12 text-accent-foreground sm:h-16 sm:w-16" />
        </div>

        <h1
          className="animate-float-up text-5xl font-black leading-none tracking-tight sm:text-7xl"
          style={{ animationDelay: "0.1s", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          PARABÉNS!
        </h1>
        <p
          className="animate-float-up text-lg text-foreground/90 sm:text-2xl"
          style={{ animationDelay: "0.2s" }}
        >
          Você concluiu o jogo!
        </p>

        {/* Cards de tempo e recorde */}
        <div
          className="animate-float-up mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="rounded-2xl bg-secondary p-5 shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Seu tempo</span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">{formatTime(time)}</p>
          </div>

          <div
            className={
              "rounded-2xl p-5 shadow-card transition-all " +
              (newRecord ? "bg-accent text-accent-foreground animate-pop" : "bg-secondary")
            }
          >
            <div className="flex items-center justify-center gap-2 opacity-80">
              <Crown className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {newRecord ? "Novo recorde!" : "Recorde"}
              </span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">{formatTime(record)}</p>
          </div>
        </div>

        {newRecord && (
          <p
            className="animate-float-up text-sm font-bold uppercase tracking-widest text-accent"
            style={{ animationDelay: "0.4s" }}
          >
            🏆 Você bateu o recorde anterior!
          </p>
        )}

        <div
          className="animate-float-up mt-4 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            to="/game"
            onClick={() => sounds.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-accent-foreground shadow-btn transition-all hover:scale-105 active:translate-y-1 active:shadow-btn-active sm:text-lg"
          >
            JOGAR NOVAMENTE
          </Link>
          <Link
            to="/"
            onClick={() => sounds.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 active:translate-y-1 active:shadow-btn-active sm:text-lg"
          >
            <HomeIcon className="h-5 w-5" />
            INÍCIO
          </Link>
        </div>
      </div>
    </div>
  );
}
