import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { sounds } from "../lib/sounds";
import BotaoSom from "../components/BotaoSom";
import AnimatedLines from "../components/LinhasAnimadas";
import logoCondutti from "../assets/logoFundoEscuro.png";
import qrCode1 from "../assets/qrcode2.png";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BotaoSom />

      {/* Brilho radial de fundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklab, var(--accent) 20%, transparent), transparent 60%)",
        }}
      />

      {/* Linhas animadas ao fundo */}
      <AnimatedLines />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        {/* Logo */}
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

        {/* QR Codes */}
        <div className=" mt-[25px] flex flex-wrap justify-center gap-8">
          {/* QR Code 1 */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[30px] text-foreground/80 font-extrabold tracking-tight animate-title">ACESSE PARA SE CADASTRAR!</p>
            <a
              href="https://landing.condutti.com.br/exposec-2026" 
              target="_blank"
              rel="noreferrer"
              className="grid h-40 w-40 place-items-center rounded-2xl p-2 shadow-card transition-transform hover:scale-105"
            >
              <img
                src={qrCode1}
                alt="QR Code 1"
                className="h-full w-full object-contain"
              />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
