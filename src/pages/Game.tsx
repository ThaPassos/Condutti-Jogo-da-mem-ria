import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { ArrowLeft, Clock, Sparkles, Crown, Hourglass } from "lucide-react";
import { ArrowLeft, Sparkles, Crown, Hourglass } from "lucide-react";
import Cartas from "../components/Cartas";
import BotaoSom from "../components/BotaoSom";
import { sounds } from "../lib/sounds";
import { formatTime, maybeSaveRecord, getRecord } from "../lib/record";
import cardBack from "../assets/card-back.png";
import card1 from "../assets/card-1.png";
import card2 from "../assets/card-2.png";
import card3 from "../assets/card-3.png";
import card4 from "../assets/card-4.png";
import card5 from "../assets/card-5.png";
import card6 from "../assets/card-6.png";
import card7 from "../assets/card-7.png";
import card8 from "../assets/card-8.png";

const PAIR_IMAGES: Record<string, string> = {
  p1: card1, p2: card2, p3: card3, p4: card4,
  p5: card5, p6: card6, p7: card7, p8: card8,
};

const PAIRS = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
const TOTAL_PAIRS = PAIRS.length;
const TIME_LIMIT = 90; // 1:30

function buildDeck() {
  const deck = PAIRS.flatMap((p, i) => [
    { uid: `${p}-a-${i}`, pairId: p, flipped: false, matched: false, wrong: false },
    { uid: `${p}-b-${i}`, pairId: p, flipped: false, matched: false, wrong: false },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function Game() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false); // controla o modal de aviso
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [deck, setDeck] = useState(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [locked, setLocked] = useState(false);
  const finishedRef = useRef(false);
  const record = getRecord();

  const timeUsed = TIME_LIMIT - timeLeft;

  // Contagem regressiva — só roda depois do start
  useEffect(() => {
    if (!started) return;
    if (finishedRef.current) return;
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [started]);

  // Som de "tick" nos últimos 10 segundos
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (timeLeft > 0 && timeLeft <= 10) {
      sounds.tick();
    }
  }, [timeLeft, started]);

  // Vitória
  useEffect(() => {
    if (pairsFound === TOTAL_PAIRS && !finishedRef.current) {
      finishedRef.current = true;
      sounds.victory();
      const result = maybeSaveRecord(timeUsed);
      const t = setTimeout(() => {
        navigate(`/win?time=${timeUsed}&record=${result.record}&isNew=${result.isNew ? 1 : 0}`);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [pairsFound, timeUsed, navigate]);

  // Derrota: tempo acabou
  useEffect(() => {
    if (started && timeLeft === 0 && !finishedRef.current) {
      finishedRef.current = true;
      sounds.timeup();
      const t = setTimeout(
        () => navigate(`/lose?pairs=${pairsFound}&total=${TOTAL_PAIRS}&time=${TIME_LIMIT}`),
        1800
      );
      return () => clearTimeout(t);
    }
  }, [timeLeft, started, navigate]);

  function handleCardClick(idx: number) {
    if (locked || !started || finishedRef.current) return;
    const card = deck[idx];
    if (card.matched || card.flipped) return;

    sounds.flip();
    const newDeck = deck.slice();
    newDeck[idx] = { ...card, flipped: true, wrong: false };
    const newSel = [...selected, idx];
    setDeck(newDeck);
    setSelected(newSel);

    if (newSel.length === 2) {
      const [a, b] = newSel;
      if (newDeck[a].pairId === newDeck[b].pairId) {
        setLocked(true);
        setTimeout(() => {
          setDeck((d) => {
            const cp = d.slice();
            cp[a] = { ...cp[a], matched: true };
            cp[b] = { ...cp[b], matched: true };
            return cp;
          });
          sounds.match();
          setPairsFound((p) => p + 1);
          setSelected([]);
          setLocked(false);
        }, 350);
      } else {
        setLocked(true);
        setTimeout(() => {
          sounds.miss();
          setDeck((d) => {
            const cp = d.slice();
            cp[a] = { ...cp[a], wrong: true };
            cp[b] = { ...cp[b], wrong: true };
            return cp;
          });
          setTimeout(() => {
            setDeck((d) => {
              const cp = d.slice();
              cp[a] = { ...cp[a], flipped: false, wrong: false };
              cp[b] = { ...cp[b], flipped: false, wrong: false };
              return cp;
            });
            setSelected([]);
            setLocked(false);
          }, 600);
        }, 600);
      }
    }
  }

  const lowTime = timeLeft <= 10 && timeLeft > 0;
  const timeOver = started && timeLeft === 0;

  return (
    <div className="relative min-h-screen pb-32">
      <BotaoSom />

      {/* Modal de aviso antes do jogo começar */}
      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-secondary p-8 text-center shadow-card">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent">
              <Hourglass className="h-8 w-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-black sm:text-3xl">ATENÇÃO!</h2>
            <p className="mt-3 text-base text-foreground/90 sm:text-lg">
              Você terá <span className="font-black text-accent">1:30</span> para encontrar
              todos os pares. Boa sorte!
            </p>
            <button
              onClick={() => {
                sounds.click();
                setStarted(true);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 hover:bg-accent active:translate-y-1 active:shadow-btn-active sm:text-lg"
            >
              COMEÇAR
            </button>
          </div>
        </div>
      )}

      {/* Overlay de tempo esgotado */}
      {timeOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl bg-secondary p-8 text-center shadow-card">
            <h2 className="text-3xl font-black text-destructive sm:text-4xl">TEMPO ESGOTADO!</h2>
            <p className="mt-3 text-base text-foreground/90 sm:text-lg">
              Voltando para o início...
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:pt-12">
        <header className="text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            JOGO DA <span className="text-accent">MEMÓRIA</span>
          </h1>
          <div className="mx-auto mt-4 h-px w-3/4 bg-border" />
        </header>

        {/* Tempo decorrido + pares + recorde + countdown */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6">
          {/* <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 shadow-card sm:px-6 sm:py-3">
            <Clock className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            <span className="text-sm font-bold tabular-nums sm:text-lg">{formatTime(timeUsed)}</span>
          </div> */}
          {/* Contagem regressiva — fica vermelho e pulsa nos últimos 10s */}
          <div
            className={
              "flex items-center gap-2 rounded-full px-4 py-2 shadow-card sm:px-6 sm:py-3 transition-colors " +
              (lowTime ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary")
            }
          >
            <Hourglass className={"h-4 w-4 sm:h-5 sm:w-5 " + (lowTime ? "" : "text-accent")} />
            <span className="text-sm font-bold tabular-nums sm:text-lg">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 shadow-card sm:px-6 sm:py-3">
            <Sparkles className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            <span className="text-sm font-bold tabular-nums sm:text-lg">
              {pairsFound}/{TOTAL_PAIRS}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 shadow-card sm:px-6 sm:py-3">
            <Crown className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            <span className="text-sm font-bold tabular-nums sm:text-lg">
              {record !== null ? formatTime(record) : "--:--"}
            </span>
          </div>
          
        </div>

        {/* Grid de cartas */}
        <div className="mx-auto mt-8 grid grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {deck.map((c, i) => (
            <Cartas
              key={c.uid}
              flipped={c.flipped}
              matched={c.matched}
              wrong={c.wrong}
              onClick={() => handleCardClick(i)}
              frontImage={cardBack}
              backImage={PAIR_IMAGES[c.pairId]}
            />
          ))}
        </div>
      </div>

      {/* Botão Voltar */}
      <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4">
        <Link
          to="/"
          onClick={() => sounds.click()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 hover:bg-accent active:translate-y-1 active:shadow-btn-active sm:text-lg"
        >
          <ArrowLeft className="h-5 w-5" />
          VOLTAR
        </Link>
      </div>
    </div>
  );
}
