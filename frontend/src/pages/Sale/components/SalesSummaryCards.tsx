import React from "react";
import { DollarSign, ShoppingBag, type LucideIcon } from "lucide-react";
import type { SalesSummary } from "@/types/sale";

interface Props {
  summary: SalesSummary;
  from?: string;
  to?: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  borderClass: string;
}

const SalesSummaryCards: React.FC<Props> = ({ summary }) => {
  const stats: StatItem[] = [
    {
      label: "Total Revenue",
      value: `$${summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconClass: "bg-sidebar-primary/15 text-sidebar-primary",
      borderClass: "border-sidebar-primary/20",
    },
    {
      label: "Total Sales",
      value: summary.salesCount.toLocaleString(),
      icon: ShoppingBag,
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      borderClass: "border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ label, value, icon: Icon, iconClass, borderClass }) => (
        <div key={label} className={`rounded-xl border-2 ${borderClass} bg-card px-5 py-5 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md`}>
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

export default SalesSummaryCards;