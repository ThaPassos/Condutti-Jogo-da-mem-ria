import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Crown, Hourglass, Eye } from "lucide-react";
import Cartas from "../components/Cartas";
import BotaoSom from "../components/BotaoSom";
import { sounds } from "../lib/sounds";
import { formatTime, maybeSaveRecord } from "../lib/record";
import { fetchGlobalRecord } from "../lib/api";
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
const TIME_LIMIT = 45; // 45 segundos
const PREVIEW_TIME = 3; // segundos com cartas viradas antes do jogo

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
  const [started, setStarted] = useState(false); // jogo em andamento
  const [previewing, setPreviewing] = useState(false); // mostrando todas as cartas
  const [previewLeft, setPreviewLeft] = useState(PREVIEW_TIME);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [deck, setDeck] = useState(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [locked, setLocked] = useState(false);
  const [globalRecord, setGlobalRecord] = useState<number | null>(null);

  const finishedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const pairsFoundRef = useRef(0);

  const timeUsed = TIME_LIMIT - timeLeft;

  // Busca recorde global ao montar
  useEffect(() => {
    fetchGlobalRecord().then(setGlobalRecord).catch(() => setGlobalRecord(null));
  }, []);

  // Inicia preview ao apertar "COMEÇAR"
  function beginPreview() {
    sounds.click();
    setPreviewing(true);
    setPreviewLeft(PREVIEW_TIME);
    // Vira todas as cartas para mostrar
    setDeck((d) => d.map((c) => ({ ...c, flipped: true })));
  }

  // Contagem regressiva do preview
  useEffect(() => {
    if (!previewing) return;
    if (previewLeft <= 0) {
      // Encerra preview: desvira tudo e inicia jogo
      setDeck((d) => d.map((c) => ({ ...c, flipped: false })));
      setPreviewing(false);
      setStarted(true);
      startTimeRef.current = Date.now();
      return;
    }
    const id = setTimeout(() => {
      sounds.tick();
      setPreviewLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [previewing, previewLeft]);

  // Contagem regressiva do jogo com Date.now() — preciso mesmo em mobile
  useEffect(() => {
    if (!started || finishedRef.current) return;

    const id = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(TIME_LIMIT - elapsed, 0);
      setTimeLeft(remaining);

      // Encerra o intervalo quando chegar a zero
      if (remaining === 0) clearInterval(id);
    }, 500); //

    return () => clearInterval(id);
  }, [started]);

  // Tick sonoro nos últimos 10s
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (timeLeft > 0 && timeLeft <= 10) sounds.tick();
  }, [timeLeft, started]);

  // Derrota por tempo
  useEffect(() => {
    if (started && timeLeft === 0 && !finishedRef.current) {
      finishedRef.current = true;
      sounds.timeup();
      const elapsed = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : TIME_LIMIT;
      const t = setTimeout(() => {
        navigate(`/derrota?pairs=${pairsFoundRef.current}&total=${TOTAL_PAIRS}&time=${elapsed}`);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [timeLeft, started, navigate]);

  function handleCardClick(idx: number) {
    if (locked || !started || previewing || finishedRef.current) return;
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
        // Par encontrado
        setLocked(true);
        setTimeout(() => {
          setDeck((d) => {
            const cp = d.slice();
            cp[a] = { ...cp[a], matched: true };
            cp[b] = { ...cp[b], matched: true };
            return cp;
          });
          sounds.match();

          const newPairsFound = pairsFoundRef.current + 1;
          pairsFoundRef.current = newPairsFound;
          setPairsFound(newPairsFound);
          setSelected([]);
          setLocked(false);

          // Verifica vitória imediatamente
          if (newPairsFound === TOTAL_PAIRS && !finishedRef.current) {
            finishedRef.current = true;
            sounds.victory();
            const elapsed = startTimeRef.current
              ? Math.floor((Date.now() - startTimeRef.current) / 1000)
              : timeUsed;
            // Salva o tempo RESTANTE (maior é melhor)
            const timeRemaining = TIME_LIMIT - elapsed;
            maybeSaveRecord(timeRemaining);
            setTimeout(() => {
              navigate(`/vitoria?time=${elapsed}`);
            }, 900);
          }
        }, 400); // Ajustado para 400ms - tempo suficiente para ver o par
      } else {
        // Par errado
        setLocked(true);
        
        // Mostra o erro brevemente
        setDeck((d) => {
          const cp = d.slice();
          cp[a] = { ...cp[a], wrong: true };
          cp[b] = { ...cp[b], wrong: true };
          return cp;
        });
        
        sounds.miss();
        
        // Delay para mostrar qual foi o erro antes de desvirar
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
      }
    }
  }

  const lowTime = timeLeft <= 10 && timeLeft > 0;
  const showStartModal = !started && !previewing;

  return (
    <div className="relative min-h-screen pb-32">
      <BotaoSom />

      {/* Modal de início com aviso do preview */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-secondary p-8 text-center shadow-card">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent">
              <Hourglass className="h-8 w-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-black sm:text-3xl">ATENÇÃO!</h2>
            <p className="mt-3 text-base text-foreground/90 sm:text-lg">
              Você terá <span className="font-black text-accent">45 segundos</span> para encontrar
              todos os pares. Boa sorte!
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              Você verá as cartas por <span className="font-black">3 segundos</span> antes do início.
            </p>
            {globalRecord !== null && (
              <p className="mt-2 text-sm text-foreground/70">
                Recorde global: <span className="font-black">{formatTime(globalRecord)}</span>
              </p>
            )}
            <button
              onClick={beginPreview}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-btn transition-all hover:scale-105 hover:bg-accent active:translate-y-1 active:shadow-btn-active sm:text-lg"
            >
              COMEÇAR
            </button>
          </div>
        </div>
      )}

      {/* Overlay de preview — banner no topo */}
      {previewing && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-accent-foreground shadow-card">
            <Eye className="h-5 w-5" />
            <span className="text-base font-black sm:text-lg">
              MEMORIZE! {previewLeft}s
            </span>
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

        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6">
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
              {globalRecord !== null ? formatTime(globalRecord) : "--:--"}
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