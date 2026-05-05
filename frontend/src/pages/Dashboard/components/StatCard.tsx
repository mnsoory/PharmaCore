import React from "react";
import { Card } from "@/components/shadcn/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  variant: "green" | "blue" | "pink" | "purple";
}

const variantBorderColors = {
  green: "var(--chart-1, #10b981)",
  blue: "var(--chart-2, #3b82f6)",
  pink: "var(--chart-3, #ec489a)",
  purple: "var(--chart-4, #8b5cf6)",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  variant,
}) => {
  const borderColor = variantBorderColors[variant];

  return (
    <Card
       className="rounded-lg border border-border bg-card py-3 px-5 shadow-sm"
      style={{
        borderLeftWidth: "5px",
        borderLeftColor: borderColor,
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{title}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          <div
            className="inline-flex items-center rounded-md font-medium shadow-sm text-xs px-2 py-0.5 text-white"
            style={{
              backgroundColor: borderColor,
            }}
          >
            {change}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;