import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Módosítás: Ne null legyen az alapértelmezett, hanem egy teszt user
  const [user, setUser] = useState({ id: 1, nev: "Teszt Felhasználó", email: "teszt@suli.hu", szerep: "ADMIN" });
  const [loading, setLoading] = useState(false); // 2. Módosítás: loading legyen false

  const checkAuth = async () => {
    // Ezt most kikommentelhetjük, amíg nincs backend, 
    // így nem fogja felülírni a fenti teszt userünket null-ra hiba esetén.
    /*
    try {
      const data = await ApiService.getMe();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
    */
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, jelszo) => {
    // Szimulált login: bármilyen adattal beléptet
    setUser({ id: 1, nev: "Teszt Felhasználó", email: email, szerep: "ADMIN" });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}