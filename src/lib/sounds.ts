// Sons sintéticos via Web Audio API — sem arquivos
let ctx: AudioContext | null = null;
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15, delay = 0) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function sweep(from: number, to: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sounds = {
  flip:    () => sweep(600, 900, 0.12, "triangle", 0.12),
  match:   () => { tone(660, 0.12, "sine", 0.18); tone(880, 0.18, "sine", 0.18, 0.1); tone(1320, 0.25, "sine", 0.15, 0.2); },
  miss:    () => { tone(300, 0.15, "sawtooth", 0.12); tone(220, 0.2, "sawtooth", 0.1, 0.1); },
  victory: () => {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => tone(n, 0.3, "triangle", 0.18, i * 0.12));
  },
  click:   () => tone(800, 0.06, "square", 0.08),
  setMuted: (v: boolean) => { muted = v; },
  isMuted: () => muted,
};
