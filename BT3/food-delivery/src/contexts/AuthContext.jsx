import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to restore session:", error);
          logout();
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const loginResponse = await api.post("/auth/login", { email, password });
      const { access_token } = loginResponse.data;

      localStorage.setItem("token", access_token);

      const profileResponse = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setUser(profileResponse.data);

      return profileResponse.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
