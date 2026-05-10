import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, UserCircle, User, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService } from "../../../services/authService";

const UserMenu: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((p) => !p);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        aria-label="User menu"
        aria-expanded={open}
        onClick={handleOpen}
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 pl-1.5 pr-2.5 transition-colors hover:bg-muted hover:border-border/80"
      >
        {/* Avatar */}
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-6 w-6 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary/15 text-sidebar-primary">
            <UserCircle className="h-5 w-5" />
          </div>
        )}

        {/* Name + email */}
        <div className="hidden flex-col text-left md:flex">
          <span className="text-sm font-medium leading-tight text-foreground">
            {user?.fullName ?? "User"}
          </span>
          <span className="max-w-30 truncate text-[11px] leading-tight text-muted-foreground">
            {user?.email ?? ""}
          </span>
        </div>

        <ChevronDown
          className={`hidden h-3 w-3 text-muted-foreground transition-transform md:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
            className="fixed z-200 w-48 rounded-lg border border-border bg-background shadow-md p-1"
          >
            {/* User info */}
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user?.email ?? ""}
              </p>
            </div>

            {/* Profile */}
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </NavLink>

            {/* Settings */}
            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </NavLink>

            <div className="my-1 h-px bg-border" />

            {/* Logout */}
            <button
              onClick={() => {
                authService.logout();
                clearAuth();
                setOpen(false);
              }}
              className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

export default UserMenu;
