import React from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore"; 
import type { Theme } from "@/types/settings"; 

const themes: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light",  label: "Light",  icon: Sun     },
  { value: "dark",   label: "Dark",   icon: Moon    },
  { value: "system", label: "System", icon: Monitor },
];

const AppearanceCard: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      <div className="px-6 py-4 border-b border-border">
        <p className="text-base font-semibold text-foreground">Appearance</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize how PharmaCore looks on your device
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* Theme */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 rounded-lg border py-4 text-sm font-medium transition-all ${
                  theme === value
                    ? "border-sidebar-primary bg-sidebar-primary/5 text-sidebar-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppearanceCard;