import React from "react";

interface TableCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const TableCard: React.FC<TableCardProps> = ({
  title,
  description,
  children,
  className = "",
}) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden ${className}`}
  >
    <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />
    <div className="flex flex-col space-y-1.5 p-6 pb-4">
      <div className="tracking-tight text-base font-semibold">{title}</div>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
    <div className="p-6 pt-0">{children}</div>
  </div>
);

export default TableCard;
