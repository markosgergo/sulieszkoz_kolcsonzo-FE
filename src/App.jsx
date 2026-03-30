import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import EszkozLista from "./pages/eszkozlista/EszkozLista";
import UjEszkoz from "./pages/ujeszkoz/UjEszkoz";
import ProtectedRoute from "./components/ProtectedRoute";
import Kolcsonzes from "./pages/kolcsonzes/Kolcsonzes";
import Regisztracio from "./pages/regisztracio/Regisztracio";
import SajatKolcsonzesek from "./pages/sajatkolcsonzesek/SajatKolcsonzesek";
import AdminKolcsonzesek from "./pages/adminkolcsonzesek/AdminKolcsonzesek";
import Profil from "./pages/profil/Profil";
import FelhasznaloLista from "./pages/felhasznalolista/FelhasznaloLista";

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
        <Route path="/admin/felhasznalok" element={<FelhasznaloLista />} />
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