import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Vitoria from "./pages/Vitoria";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Jogo" element={<Game />} />
        <Route path="/Vitória" element={<Vitoria />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
