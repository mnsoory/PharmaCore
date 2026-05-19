import React from "react";
import { AtSign, Calendar, Hash } from "lucide-react";

interface Profile {
  id: number;
  username: string;
  role: string;
  joinedAt: string;
}

interface Props { profile: Profile; }

const AccountInfoCard: React.FC<Props> = ({ profile }) => {
  const fields = [
    {
      icon: Hash,
      label: "User ID",
      value: `#${profile.id}`,
    },
    {
      icon: AtSign,
      label: "Username",
      value: `@${profile.username}`,
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: new Date(profile.joinedAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric",
      }),
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      <div className="px-6 py-4 border-b border-border">
        <p className="text-base font-semibold text-foreground">Account Information</p>
        <p className="text-sm text-muted-foreground mt-0.5">Read-only account details</p>
      </div>

      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
            <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-5">
        <p className="text-xs text-muted-foreground">
          Username and account ID cannot be changed. Contact an administrator if you need to update these details.
        </p>
      </div>
    </div>
  );
};

export default AccountInfoCard;