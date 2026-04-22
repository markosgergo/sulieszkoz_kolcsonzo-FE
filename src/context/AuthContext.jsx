import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Oldalbetöltéskor ellenőrizzük van-e érvényes JWT cookie
  const checkAuth = async () => {
    try {
      const data = await ApiService.getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, jelszo) => {
    await ApiService.login(email, jelszo);
    const userData = await ApiService.getMe();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
