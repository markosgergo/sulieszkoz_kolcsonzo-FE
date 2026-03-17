import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await ApiService.getMe();
      setUser(data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, jelszo) => {
    // Meghívjuk a valódi backendet
    const response = await ApiService.login(email, jelszo);
    
    // A backend válaszában lévő tokent elmentjük
    localStorage.setItem("token", response.token); 
    
    // A válasz többi részét (név, email, szerepkör) beállítjuk usernek
    setUser(response); 
    return response; // Visszaadjuk, hogy a Login.js tudja, sikerült
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}