import { useEffect, useState } from "react";
import { sounds } from "../lib/sounds";

// Hook que controla mudo / com som
export function useSound() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    sounds.setMuted(muted);
  }, [muted]);

  return { muted, toggle: () => setMuted((m) => !m) };
}
