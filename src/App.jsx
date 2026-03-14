import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EszkozLista from "./pages/EszkozLista";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/eszkozok" element={<EszkozLista />} />
    </Routes>
  );
}

export default App;