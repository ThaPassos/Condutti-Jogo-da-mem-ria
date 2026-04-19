import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "../hooks/useSound";

export default function SoundToggle() {
  const { muted, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Ativar som" : "Desativar som"}
      className="fixed top-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-btn transition-transform hover:scale-110 active:translate-y-1"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
}
