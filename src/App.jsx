import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EszkozLista from "./pages/EszkozLista";
import UjEszkoz from "./pages/UjEszkoz";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/eszkozok" element={<EszkozLista />} />
        <Route path="/eszkozok/uj" element={<UjEszkoz />} />
      </Routes>
    </>
  );
}

export default App;