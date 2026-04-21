const KEY = "memoria-record-seconds";

export function getRecord(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function maybeSaveRecord(seconds: number): { isNew: boolean; record: number } {
  // Ignora tempos inválidos (0 ou negativos) — evita salvar lixo
  if (seconds < 1) {
    const current = getRecord();
    return { isNew: false, record: current ?? 0 };
  }

  try {
    const current = getRecord();
    if (current === null || seconds < current) {
      window.localStorage.setItem(KEY, String(seconds));
      return { isNew: true, record: seconds };
    }
    return { isNew: false, record: current };
  } catch {
    return { isNew: false, record: seconds };
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Para limpar o recorde via DevTools:
// localStorage.removeItem("memoria-record-seconds")
