import React, { createContext, ReactNode, useContext } from "react";
import { useAuthStore, AuthUser } from "@/store/authStore";

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isLoggedIn, setAuth, clearUser } = useAuthStore();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        setAuth,
        clearAuth: clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
