import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../utils/request";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // const fetchCurrentUser = useCallback(async () => {
  //   try {
  //     const response = await api.get("/auth/me");
  //     const currentUser =
  //       response.data?.user ?? response.data?.data?.user ?? response.data?.data;
  //     setUser(currentUser || null);
  //     return currentUser || null;
  //   } catch (error) {
  //     setUser(null);
  //     return null;
  //   } finally {
  //     setAuthLoading(false);
  //   }
  // }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");

      const currentUser =
        response.data?.user ??
        response.data?.data?.user ??
        response.data?.data ??
        null;

      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // const logout = async () => {
  //   // سنربط هذا الجزء بمسار Logout الموجود في Backend.
  //   await fetchCurrentUser();
  // };
  // const logout = async () => {
  //   try {
  //     await api.post("/auth/logout");
  //     setUser(null);
  //   } catch (error) {
  //     console.error("Logout failed:", error.response?.data || error.message);

  //     throw error;
  //   }
  // };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
