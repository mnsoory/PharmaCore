import React from "react";
import { Users, UserCheck, UserX, ShieldCheck, type LucideIcon } from "lucide-react";

interface Props {
  total: number;
  active: number;
  inactive: number;
  admins: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
  borderClass: string;
}

const StaffStatCards: React.FC<Props> = ({ total, active, inactive, admins }) => {
  const stats: StatItem[] = [
    {
      label: "Total Staff",
      value: total,
      icon: Users,
      iconClass: "bg-sidebar-primary/15 text-sidebar-primary",
      borderClass: "border-sidebar-primary/20",
    },
    {
      label: "Active",
      value: active,
      icon: UserCheck,
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      borderClass: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Inactive",
      value: inactive,
      icon: UserX,
      iconClass: "bg-destructive/15 text-destructive",
      borderClass: "border-destructive/20",
    },
    {
      label: "Admins",
      value: admins,
      icon: ShieldCheck,
      iconClass: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
      borderClass: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, iconClass, borderClass }) => (
        <div
          key={label}
          className={`rounded-xl border-2 ${borderClass} bg-card px-5 py-5 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground leading-tight mb-0.5">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffStatCards;