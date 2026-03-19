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
    // 1. Bejelentkezés
    const response = await ApiService.login(email, jelszo);
    
    // 2. Token mentése (ApiService-től függően response.token vagy response.data.token)
    const token = response.token || response.data?.token;
    localStorage.setItem("token", token); 
    
    // 3. Friss adatok lekérése a "me" végpontról, hogy ugyanaz legyen az állapot, mint F5 után
    try {
      const userData = await ApiService.getMe();
      setUser(userData); // Ez frissíti a Navbart azonnal!
      return userData;
    } catch (error) {
      // Ha a getMe hibaágra futna, állítsuk be a response-ból az adatokat
      setUser(response);
      return response;
    }
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