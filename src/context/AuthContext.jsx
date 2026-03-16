import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Visszaállítjuk null-ra, hogy tényleg csak bejelentkezés után legyen user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Megpróbáljuk lekérni a belépett felhasználót a backendtől
      const data = await ApiService.getMe();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, jelszo) => {
    // 2. Itt a trükk: most már az ApiService-t hívjuk meg!
    const response = await ApiService.login(email, jelszo);
    
    // Elmentjük a kapott tokent a böngészőbe
    localStorage.setItem("token", response.token); 
    
    // Frissítjük a user állapotát a válaszból kapott adatokkal
    setUser(response.user);
  };

  const logout = async () => {
    localStorage.removeItem("token");
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