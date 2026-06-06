import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriguide_user"));
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem("nutriguide_token");
  });

  // On mount: if we have a token, verify it and refresh user state
  useEffect(() => {
    const token = localStorage.getItem("nutriguide_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((userData) => {
        localStorage.setItem("nutriguide_user", JSON.stringify(userData));
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("nutriguide_token");
        localStorage.removeItem("nutriguide_user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem("nutriguide_token", data.access_token);
      localStorage.setItem("nutriguide_user", JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.detail || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, fullName, password) => {
    setLoading(true);
    try {
      const data = await authApi.register({
        email,
        full_name: fullName,
        password,
      });
      localStorage.setItem("nutriguide_token", data.access_token);
      localStorage.setItem("nutriguide_user", JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.detail || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = async (accessToken) => {
    setLoading(true);
    try {
      localStorage.setItem("nutriguide_token", accessToken);
      const userData = await authApi.me();
      localStorage.setItem("nutriguide_user", JSON.stringify(userData));
      setUser(userData);
      return { ok: true, user: userData };
    } catch (err) {
      localStorage.removeItem("nutriguide_token");
      localStorage.removeItem("nutriguide_user");
      return { ok: false, error: "Failed to load profile" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://nutri-ai-back.onrender.com";
    window.location.href = `${apiUrl}/auth/google/login`;
  };

  const loginWithFacebook = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://nutri-ai-back.onrender.com";
    window.location.href = `${apiUrl}/auth/facebook/login`;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    localStorage.removeItem("nutriguide_token");
    localStorage.removeItem("nutriguide_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithToken,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
