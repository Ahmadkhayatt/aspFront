// src/context/AuthContext.js
import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  const login = (payload) => {
    setUser(payload);
    localStorage.setItem("user", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
