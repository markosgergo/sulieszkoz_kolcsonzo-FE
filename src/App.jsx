import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
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
import { useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

// ADMIN + ALKALMAZOTT: kölcsönzés kiadása/visszavétele
function StaffRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.szerepkorNev !== "ADMIN" && user.szerepkorNev !== "ALKALMAZOTT") return <Navigate to="/" replace />;
  return children;
}

// Csak ADMIN: felhasználók kezelése, új eszköz hozzáadása/törlése
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.szerepkorNev !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/sajat-kolcsonzesek" element={<SajatKolcsonzesek />} />
        <Route path="/profil" element={<Profil />} />

        {/* ADMIN + ALKALMAZOTT: kölcsönzés kiadás/visszavétel */}
        <Route path="/admin/kolcsonzesek" element={
          <StaffRoute><AdminKolcsonzesek /></StaffRoute>
        } />

        {/* Csak ADMIN: felhasználók és eszközök adminisztrációja */}
        <Route path="/admin/felhasznalok" element={
          <AdminRoute><FelhasznaloLista /></AdminRoute>
        } />
        <Route path="/eszkozok/uj" element={
          <AdminRoute><UjEszkoz /></AdminRoute>
        } />

        {/* Bejelentkezés szükséges */}
        <Route path="/eszkozok" element={
          <ProtectedRoute><EszkozLista /></ProtectedRoute>
        } />
        <Route path="/kolcsonzes/:id" element={
          <ProtectedRoute><Kolcsonzes /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;