import React from "react";
import { Package, TrendingDown, PackageX, ShieldCheck, type LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClass: string;
  borderClass: string;
}

interface Props {
  totalDrugs: number;
  lowStock: number;
  outOfStock: number;
  safeStock: number;
}

const InventoryStatCards: React.FC<Props> = ({
  totalDrugs, lowStock, outOfStock, safeStock,
}) => {
  const stats: StatItem[] = [
    {
      label: "Total Drugs",
      value: totalDrugs.toLocaleString(),
      icon: Package,
      iconClass: "bg-sidebar-primary/20 text-sidebar-primary",
      borderClass: "border-sidebar-primary/20",
    },
    {
      label: "Low Stock",
      value: lowStock,
      icon: TrendingDown,
      iconClass: "bg-warning/40 text-warning-foreground",
      borderClass: "border-warning/20",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: PackageX,
      iconClass: "bg-destructive/15 text-destructive",
      borderClass: "border-destructive/20",
    },
    {
      label: "Safe Stock",
      value: safeStock,
      icon: ShieldCheck, 
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      borderClass: "border-emerald-200 dark:border-emerald-800/60",
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

export default InventoryStatCards;