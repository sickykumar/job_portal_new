import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Only start in loading state if there are existing credentials to verify
  const [loading, setLoading] = useState(() => {
    try {
      return Boolean(localStorage.getItem("token") || localStorage.getItem("user"));
    } catch {
      return false;
    }
  });

  // Fetch current logged in user on mount to verify session
  useEffect(() => {
    // Fast-path: If no credentials saved at all, exit immediately
    const hasCreds = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));
    if (!hasCreds) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data?.success) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
