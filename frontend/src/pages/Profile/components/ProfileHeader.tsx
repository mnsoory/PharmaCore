import React from "react";
import { ShieldCheck } from "lucide-react";

interface Profile {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface Props { profile: Profile; }

const roleConfig: Record<string, string> = {
  "Admin":      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  "Manager":    "bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-950   dark:text-blue-300   dark:border-blue-800",
  "Pharmacist": "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  const initials = `${profile.firstname[0]}${profile.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="rounded-xl border-2 border-sidebar-primary/20 bg-card shadow-sm overflow-hidden">
      {/* Top accent */}
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      <div className="px-6 py-6 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sidebar-primary/15 text-2xl font-bold text-sidebar-primary border-4 border-background shadow-md">
            {initials}
          </div>
          {profile.isActive && (
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">
            {profile.firstname} {profile.lastname}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{profile.email}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-semibold ${roleConfig[profile.role] ?? "bg-muted text-muted-foreground border-border"}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.role}
            </span>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${
              profile.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;