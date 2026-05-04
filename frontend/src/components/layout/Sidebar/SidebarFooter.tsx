import React from "react";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService } from "../../../services/authService";

const SidebarFooter: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2">
        <NavLink
          to="/profile"
          className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/80 text-[11px] font-bold text-sidebar-primary-foreground">
              {initials}
            </div>
          )}
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user?.fullName ?? "User"}
            </span>
            <span className="text-[11px] text-sidebar-foreground/50">
              {user?.role ?? "Staff"}
            </span>
          </div>
        </NavLink>

        <button
          aria-label="Log out"
          onClick={() => { authService.logout(); clearAuth(); }}
          className="rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;