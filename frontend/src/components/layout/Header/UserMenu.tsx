import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, UserCircle } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService } from "../../../services/authService";

const UserMenu: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="User menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className="flex h-10 items-center gap-3 rounded-full bg-slate-100 p-1.5 pr-2.5 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-6 w-6 rounded-full border border-white object-cover dark:border-slate-700"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <UserCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
        )}
        <div className="hidden flex-col text-left sm:flex">
          <span className="text-14 font-medium leading-tight text-slate-800 dark:text-slate-100">
            {user?.fullName ?? "User"}
          </span>
          <span className="max-w-25 truncate text-[12px] leading-tight text-slate-400">
            {user?.email ?? ""}
          </span>
        </div>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">
            Profile
          </button>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">
            Settings
          </button>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
          <button
            onClick={() => {
              authService.logout();
              clearAuth();
              setOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
