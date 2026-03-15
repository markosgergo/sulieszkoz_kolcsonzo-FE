import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EszkozLista from "./pages/EszkozLista";
import UjEszkoz from "./pages/UjEszkoz";
import ProtectedRoute from "./components/ProtectedRoute";
import Kolcsonzes from "./pages/Kolcsonzes";

function App() {
  return (
    <>
      <Navbar />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
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