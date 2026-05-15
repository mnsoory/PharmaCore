import React from "react";
import type { Sale } from "@/types/sale";

interface Props {
  sales: Sale[];
}

const SalesRevenueChart: React.FC<Props> = ({ sales }) => {
  const grouped = sales.reduce<Record<string, number>>((acc, sale) => {
    const day = new Date(sale.saleDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    acc[day] = (acc[day] ?? 0) + sale.totalAmount;
    return acc;
  }, {});

  const data = Object.entries(grouped).slice(-10);
  const max  = Math.max(...data.map(([, v]) => v), 1);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />
      <div className="p-6">
        <div className="mb-6">
          <p className="text-base font-semibold text-foreground">Revenue Trend</p>
          <p className="text-sm text-muted-foreground mt-0.5">Daily revenue from report period</p>
        </div>

        {data.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {data.map(([period, revenue]) => {
              const heightPct = (revenue / max) * 100;
              return (
                <div key={period} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    ${revenue.toFixed(0)}
                  </span>
                  <div className="relative w-full" style={{ height: "120px" }}>
                    <div className="absolute bottom-0 w-full rounded-t-md bg-sidebar-primary/10" style={{ height: "100%" }} />
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-sidebar-primary transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{period}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesRevenueChart;