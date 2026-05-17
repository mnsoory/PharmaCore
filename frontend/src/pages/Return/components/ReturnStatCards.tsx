import React from "react";
import { RotateCcw, DollarSign, ShoppingBag, type LucideIcon } from "lucide-react";

interface Props {
  totalReturns: number;
  totalRefunded: number;
  thisMonth: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  borderClass: string;
}

const ReturnStatCards: React.FC<Props> = ({ totalReturns, totalRefunded, thisMonth }) => {
  const stats: StatItem[] = [
    {
      label: "Total Returns",
      value: totalReturns.toLocaleString(),
      icon: RotateCcw,
      iconClass: "bg-sidebar-primary/15 text-sidebar-primary",
      borderClass: "border-sidebar-primary/20",
    },
    {
      label: "Total Refunded",
      value: `$${totalRefunded.toFixed(2)}`,
      icon: DollarSign,
      iconClass: "bg-destructive/15 text-destructive",
      borderClass: "border-destructive/20",
    },
    {
      label: "This Month",
      value: thisMonth.toLocaleString(),
      icon: ShoppingBag,
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
      borderClass: "border-amber-200 dark:border-amber-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

export default ReturnStatCards;