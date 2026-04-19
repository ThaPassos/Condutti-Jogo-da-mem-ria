const KEY = "memoria-record-seconds";

export function getRecord(): number | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function maybeSaveRecord(seconds: number): { isNew: boolean; record: number } {
  const current = getRecord();
  if (current == null || seconds < current) {
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, String(seconds));
    return { isNew: true, record: seconds };
  }
  return { isNew: false, record: current };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
