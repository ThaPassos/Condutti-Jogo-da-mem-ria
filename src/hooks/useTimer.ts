import { useEffect, useState } from "react";

// Hook simples: começa em 0 e incrementa 1 a cada segundo
export function useTimer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
