import React from "react";
import { Building2, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";

interface Props {
  total: number;
  active: number;
  inactive: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
  borderClass: string;
}

const SupplierStatCards: React.FC<Props> = ({ total, active, inactive }) => {
  const stats: StatItem[] = [
    {
      label: "Total Suppliers",
      value: total,
      icon: Building2,
      iconClass: "bg-sidebar-primary/15 text-sidebar-primary",
      borderClass: "border-sidebar-primary/20",
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      borderClass: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Inactive",
      value: inactive,
      icon: XCircle,
      iconClass: "bg-destructive/15 text-destructive",
      borderClass: "border-destructive/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

export default SupplierStatCards;