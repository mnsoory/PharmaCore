import React from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../../store/useThemeStore";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;