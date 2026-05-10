import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../types/settings";

interface ThemeStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === "dark")  root.classList.add("dark");
        else if (theme === "light") root.classList.remove("dark");
        else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.toggle("dark", prefersDark);
        }
      },
    }),
    { name: "theme-settings" }
  )
);