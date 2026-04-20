import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import Cartas from "../components/Cartas";
import BotaoSom from "../components/BotaoSom";
import { sounds } from "../lib/sounds";
import { formatTime, maybySaveRecord } from "../lib/record";
import { useTimer } from "../hooks/useTimer";
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

interface CardState {
  uid: string;
  pairId: string;
  flipped: boolean;
  matched: boolean;
  wrong: boolean;
}

function buildDeck(): CardState[] {
  const deck: CardState[] = PAIRS.flatMap((p, i) => [
    { uid: `${p}-a-${i}`, pairId: p, flipped: false, matched: false, wrong: false },
    { uid: `${p}-b-${i}`, pairId: p, flipped: false, matched: false, wrong: false },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function GamePage() {
  const navigate = useNavigate();
  const time = useTimer();
  const [deck, setDeck] = useState<CardState[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [locked, setLocked] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (pairsFound === TOTAL_PAIRS && !finishedRef.current) {
      finishedRef.current = true;
      sounds.victory();
      const result = maybySaveRecord(time);
      const t = setTimeout(() => {
        navigate(`/vitoria?time=${time}&record=${result.record}&isNew=${result.isNew ? 1 : 0}`);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [pairsFound, time, navigate]);

  function handleCardClick(idx: number) {
    if (locked) return;
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

  return (
    <div className="relative min-h-screen pb-32">
      <BotaoSom />

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:pt-12">
        <header className="text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            JOGO DA <span className="text-accent">MEMÓRIA</span>
          </h1>
          <div className="mx-auto mt-4 h-px w-3/4 bg-border" />
        </header>

        <div className="mt-6 flex justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 shadow-card sm:px-6 sm:py-3">
            <Clock className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            <span className="text-sm font-bold tabular-nums sm:text-lg">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 shadow-card sm:px-6 sm:py-3">
            <Sparkles className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            <span className="text-sm font-bold tabular-nums sm:text-lg">
              {pairsFound}/{TOTAL_PAIRS}
            </span>
          </div>
        </div>

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
