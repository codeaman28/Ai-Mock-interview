import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("mockai_token");
      const storedUser = localStorage.getItem("mockai_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("mockai_token");
      localStorage.removeItem("mockai_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("mockai_token", newToken);
    localStorage.setItem("mockai_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("mockai_token");
    localStorage.removeItem("mockai_user");
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
