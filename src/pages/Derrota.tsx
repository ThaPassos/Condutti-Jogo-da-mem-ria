import { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Clock, Sparkles, Frown, Home as HomeIcon } from "lucide-react";
import BotaoSom from "../components/BotaoSom";
import { formatTime } from "../lib/record";
import { sounds } from "../lib/sounds";

export default function Lose() {
  const [params] = useSearchParams();
  const pairs = Number(params.get("pairs")) || 0;
  const total = Number(params.get("total")) || 8;
  const time = Number(params.get("time")) || 0;
  const navigate = useNavigate();

  // Redireciona para o início após 10 segundos
  useEffect(() => {
    const id = setTimeout(() => navigate("/"), 15000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BotaoSom />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--destructive) 25%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="animate-float-up grid h-24 w-24 place-items-center rounded-full bg-destructive shadow-card sm:h-32 sm:w-32">
          <Frown className="h-12 w-12 text-destructive-foreground sm:h-16 sm:w-16" />
        </div>

        <h1
          className="animate-float-up text-5xl font-black leading-none tracking-tight sm:text-7xl"
          style={{ animationDelay: "0.1s", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          TEMPO ESGOTADO!
        </h1>
        <p
          className="animate-float-up text-lg text-foreground/90 sm:text-2xl"
          style={{ animationDelay: "0.2s" }}
        >
          Não foi dessa vez. Tente novamente!
        </p>

        {/* Cards de tempo e pares encontrados */}
        <div
          className="animate-float-up mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="rounded-2xl bg-secondary p-5 shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Tempo jogado</span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">{formatTime(time)}</p>
          </div>

          <div className="rounded-2xl bg-secondary p-5 shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Pares encontrados</span>
            </div>
            <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">
              {pairs}/{total}
            </p>
          </div>
        </div>

        <div
          className="animate-float-up mt-4 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            to="/jogo"
            onClick={() => sounds.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-accent-foreground shadow-btn transition-all hover:scale-105 active:translate-y-1 active:shadow-btn-active sm:text-lg"
          >
            TENTAR NOVAMENTE
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