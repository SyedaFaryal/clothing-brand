import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("noir_admin_user");
    if (saved) setAdmin(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user, token } = await api.login(email, password);
    if (user.role !== "admin") {
      throw new Error("This account does not have admin access");
    }
    localStorage.setItem("noir_admin_token", token);
    localStorage.setItem("noir_admin_user", JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem("noir_admin_token");
    localStorage.removeItem("noir_admin_user");
    setAdmin(null);
  };

  const setSession = (user, token) => {
    localStorage.setItem("noir_admin_token", token);
    localStorage.setItem("noir_admin_user", JSON.stringify(user));
    setAdmin(user);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
