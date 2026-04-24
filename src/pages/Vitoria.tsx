import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trophy, Clock, Crown, Home as HomeIcon, Globe } from "lucide-react";
import Confetes from "../components/Confetes";
import BotaoSom from "../components/BotaoSom";
import Roleta from "../components/Roleta";
import { formatTime } from "../lib/record";
import { fetchGlobalRecord, saveGlobalRecord } from "../lib/api";
import { sounds } from "../lib/sounds";

export default function Vitoria() {
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

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 py-8 text-center">
        <div className="animate-float-up grid h-16 w-16 place-items-center rounded-full bg-accent shadow-card sm:h-20 sm:w-20">
          <Trophy className="h-8 w-8 text-accent-foreground sm:h-10 sm:w-10" />
        </div>

        <h1
          className="animate-float-up text-3xl font-black leading-none tracking-tight sm:text-5xl"
          style={{ animationDelay: "0.1s", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          PARABÉNS!
        </h1>

        {/* Cards de tempo e recorde — layout compacto do primeiro */}
        <div
          className="animate-float-up grid w-full grid-cols-2 gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="rounded-xl bg-secondary p-3 shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Seu tempo</span>
            </div>
            <p className="mt-1 text-2xl font-black tabular-nums sm:text-3xl">{formatTime(time)}</p>
          </div>

          <div
            className={
              "rounded-xl p-3 shadow-card transition-all " +
              (isNewGlobal ? "bg-accent text-accent-foreground animate-pop" : "bg-secondary")
            }
          >
            <div className="flex items-center justify-center gap-2 opacity-80">
              {isNewGlobal ? (
                <Crown className="h-3 w-3" />
              ) : (
                <Globe className="h-3 w-3" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isNewGlobal ? "Novo recorde!" : "Recorde global"}
              </span>
            </div>
            <p className="mt-1 text-2xl font-black tabular-nums sm:text-3xl">
              {loading ? "..." : globalRecord !== null ? formatTime(globalRecord) : "--:--"}
            </p>
          </div>
        </div>


        {isNewGlobal && !loading && (
          <p
            className="animate-float-up -mt-4 text-sm font-bold uppercase tracking-widest text-accent mb-[70px]"
            style={{ animationDelay: "0.45s" }}
          >
            Você bateu o recorde global!
          </p>
        )}

        {/* Roleta de brindes - mantida do primeiro código */}
        <div
          className="animate-float-up mt-2 mb-[70px] 
                    w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"
          style={{ animationDelay: "0.4s" }}
        >
          <Roleta />
        </div>

        <div
          className="animate-float-up flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            to="/game"
            onClick={() => sounds.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-btn transition-all hover:scale-105 active:translate-y-1 active:shadow-btn-active sm:text-base"
          >
            JOGAR NOVAMENTE
          </Link>
          <Link
            to="/"
            onClick={() => sounds.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 active:translate-y-1 active:shadow-btn-active sm:text-base"
          >
            <HomeIcon className="h-4 w-4" />
            INÍCIO
          </Link>
        </div>
      </div>
    </div>
  );
}