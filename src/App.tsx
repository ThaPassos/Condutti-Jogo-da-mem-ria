import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Vitoria from "./pages/Vitoria";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogo" element={<Game />} />
        <Route path="/vitoria" element={<Vitoria />} />
        <Route path="derrota" element/>
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
