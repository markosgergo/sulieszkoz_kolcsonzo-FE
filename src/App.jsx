import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EszkozLista from "./pages/EszkozLista";
import UjEszkoz from "./pages/UjEszkoz";
import ProtectedRoute from "./components/ProtectedRoute";
import Kolcsonzes from "./pages/Kolcsonzes";
import Regisztracio from "./pages/Regisztracio";
import SajatKolcsonzesek from "./pages/SajatKolcsonzesek";
import AdminKolcsonzesek from "./pages/AdminKolcsonzesek";
import Profil from "./pages/Profil";

function App() {
  return (
    <>
      <Navbar />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/sajat-kolcsonzesek" element={<SajatKolcsonzesek />} />
        <Route path="/admin/kolcsonzesek" element={<AdminKolcsonzesek />} />
        <Route path="/profil" element={<Profil />} />
        {/* Ezeket is érdemes védeni, ha csak belépett felhasználó láthatja */}
        <Route path="/eszkozok" element={
          <ProtectedRoute><EszkozLista /></ProtectedRoute>
        } />
        <Route path="/eszkozok/uj" element={
          <ProtectedRoute><UjEszkoz /></ProtectedRoute>
        } />
        <Route path="/kolcsonzes/:id" element={
          <ProtectedRoute><Kolcsonzes /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;