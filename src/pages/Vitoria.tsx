import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trophy, Clock, Crown, Home as HomeIcon, Globe } from "lucide-react";
import Confetes from "../components/Confetes";
import BotaoSom from "../components/BotaoSom";
import { formatTime } from "../lib/record";
import { fetchGlobalRecord, saveGlobalRecord } from "../lib/api";
import { sounds } from "../lib/sounds";

export default function Win() {
  const [params] = useSearchParams();
  const time = Number(params.get("time")) || 0;

  const [globalRecord, setGlobalRecord] = useState<number | null>(null);
  const [isNewGlobal, setIsNewGlobal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (time < 1) return;

    async function handleRecord() {
      try {
        // Busca o recorde global atual antes de salvar
        const current = await fetchGlobalRecord();

        // Salva o novo tempo e recebe o melhor recorde atualizado
        const best = await saveGlobalRecord(time);

        setGlobalRecord(best);
        // É novo recorde global se melhorou (ou não havia nenhum)
        setIsNewGlobal(current === null || time < current);
      } catch {
        setGlobalRecord(null);
      } finally {
        setLoading(false);
      }
    }

    handleRecord();
  }, [time]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BotaoSom />
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

        <div
          className="animate-float-up mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Seu tempo */}
          <div className="rounded-2xl bg-secondary p-5 shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Seu tempo</span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">{formatTime(time)}</p>
          </div>

          {/* Recorde global */}
          <div
            className={
              "rounded-2xl p-5 shadow-card transition-all " +
              (isNewGlobal ? "bg-accent text-accent-foreground animate-pop" : "bg-secondary")
            }
          >
            <div className="flex items-center justify-center gap-2 opacity-80">
              {isNewGlobal ? (
                <Crown className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span className="text-xs font-bold uppercase tracking-widest">
                {isNewGlobal ? "Novo recorde!" : "Recorde global"}
              </span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">
              {loading ? "..." : globalRecord !== null ? formatTime(globalRecord) : "--:--"}
            </p>
          </div>
        </div>

        {isNewGlobal && !loading && (
          <p
            className="animate-float-up text-sm font-bold uppercase tracking-widest text-accent"
            style={{ animationDelay: "0.4s" }}
          >
            Você bateu o recorde!
          </p>
        )}

        <div
          className="animate-float-up mt-4 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            to="/jogo"
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