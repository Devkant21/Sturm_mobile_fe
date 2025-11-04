import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),

      clearUser: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage-user",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
