import React from "react";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService } from "../../../services/authService";

interface SidebarFooterProps {
  collapsed?: boolean; 
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed = false }) => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  const avatarElement = (
    <>
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
    </>
  );

  if (collapsed) {
    return (
      <div className="border-t border-sidebar-border p-3 pb-6">
        <div className="flex flex-col items-center gap-3">
          <NavLink
            to="/profile"
            className="flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-sidebar-accent/50"
          >
            {avatarElement}
          </NavLink>

          <button
            aria-label="Log out"
            onClick={() => {
              authService.logout();
              clearAuth();
            }}
            className="rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2">
        <NavLink
          to="/profile"
          className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent/50"
        >
          {avatarElement}
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
          onClick={() => {
            authService.logout();
            clearAuth();
          }}
          className="rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;