import React from "react";
import { Pill } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebarStore } from "../../../store/useSidebarStore";

const SidebarHeader: React.FC = () => {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
      <Link
        to="/"
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Pill className="h-4 w-4 text-sidebar-primary-foreground" aria-hidden="true" />
        </div>

        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              PharmaCore
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
              Dashboard
            </span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default SidebarHeader;