import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifikasi token yang tersimpan saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("purrfocus_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    authAPI.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("purrfocus_token"))
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for 401 unauthorized dari API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("purrfocus-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("purrfocus-unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem("purrfocus_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await authAPI.register({ username, email, password });
    localStorage.setItem("purrfocus_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("purrfocus_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
