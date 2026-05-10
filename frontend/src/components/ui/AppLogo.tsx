import React from "react";
import { Pill } from "lucide-react";

interface AppLogoProps {
  showSub?: boolean;
  sub?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({
  showSub = true,
  sub = "Management System",
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
      <Pill className="h-4 w-4 text-sidebar-primary-foreground" aria-hidden="true" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold tracking-tight text-foreground">
        PharmaCore
      </span>
      {showSub && (
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {sub}
        </span>
      )}
    </div>
  </div>
);

export default AppLogo;