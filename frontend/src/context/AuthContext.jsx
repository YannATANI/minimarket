import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextCore";
import { API } from "../config/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/auth/Session.php`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data.loggedIn) setUser(data.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login  = (userData) => setUser(userData);
  const logout = async () => {
    await fetch(`${API}/auth/Session.php`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "admin", loading }}>
      {children}
    </AuthContext.Provider>
  );
};