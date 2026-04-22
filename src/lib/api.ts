const API_URL = "/.netlify/functions/record";

export async function fetchGlobalRecord(): Promise<number | null> {
  try {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error("Falha ao buscar recorde");
    const data = await res.json();
    return typeof data.best === "number" ? data.best : null;
  } catch {
    // Fallback: retorna o recorde local
    return getLocalRecord();
  }
}

export async function saveGlobalRecord(time: number): Promise<number> {
  // Sempre salva localmente também (fallback para totem/offline)
  saveLocalRecord(time);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time }),
    });
    if (!res.ok) throw new Error("Falha ao salvar recorde");
    const data = await res.json();
    return typeof data.best === "number" ? data.best : time;
  } catch {
    // Fallback: retorna o melhor entre local e o tempo atual
    const local = getLocalRecord();
    return local !== null ? Math.min(local, time) : time;
  }
}

// --- LocalStorage (fallback) ---
const LOCAL_KEY = "memoria-record-seconds";

function getLocalRecord(): number | null {
  try {
    const v = localStorage.getItem(LOCAL_KEY);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function saveLocalRecord(time: number): void {
  try {
    const current = getLocalRecord();
    if (current === null || time < current) {
      localStorage.setItem(LOCAL_KEY, String(time));
    }
  } catch {
    // ignora erros de localStorage (ex: modo privado)
  }
}