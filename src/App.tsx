import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Vitoria from "./pages/Vitoria";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogo" element={<Game />} />
        <Route path="/vitoria" element={<Vitoria />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
