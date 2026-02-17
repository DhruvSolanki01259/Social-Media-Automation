import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",

      setTheme: (newTheme) => set({ theme: newTheme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage", // key in localStorage
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);