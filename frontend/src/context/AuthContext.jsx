import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api, { setAuthToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => (token ? jwtDecode(token) : null));
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Inicia el token al montar el provider
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
      setUser(jwtDecode(savedToken));
    }
    setLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      setUser(jwtDecode(token));
      localStorage.setItem("token", token);
    } else {
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const newToken = res.data.token || res.data.accessToken;
    if (!newToken) throw new Error("No token received");
    setToken(newToken);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
