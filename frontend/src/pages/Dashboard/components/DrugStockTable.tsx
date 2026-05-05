import React from "react";
import { Pill } from "lucide-react";
import TableCard from "@/components/ui/table/TableCard";
import TableShell from "@/components/ui/table/TableShell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";

interface DrugStock {
  tradeName: string;
  genericName: string;
  concentration: string;
  currentStock: number;
  minimumStockThreshold: number;
}

interface DrugStockTableProps {
  drugs: DrugStock[];
  title: string;
  description?: string;
}

const StockBar: React.FC<{ current: number; threshold: number }> = ({
  current,
  threshold,
}) => {
  const pct = Math.min((current / threshold) * 100, 100);
  const color =
    pct < 40 ? "bg-destructive" : pct < 90 ? "bg-warning" : "bg-success";
  const textColor =
    pct < 40
      ? "text-destructive"
      : pct < 90
        ? "text-warning-foreground"
        : "text-success-foreground";
  const bgBadge =
    pct < 40
      ? "bg-destructive/10"
      : pct < 90
        ? "bg-warning/10"
        : "bg-success/10";

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={`text-sm font-bold w-fit rounded-md px-1.5 py-0.5 ${textColor} ${bgBadge}`}
      >
        {current}
      </span>
      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const DrugStockTable: React.FC<DrugStockTableProps> = ({
  drugs,
  title,
  description,
}) => (
  <TableCard title={title} description={description}>
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          <TableHeaderCell>Medication</TableHeaderCell>
          <TableHeaderCell>Generic Name</TableHeaderCell>
          <TableHeaderCell hideBelow="sm">Concentration</TableHeaderCell>
          <TableHeaderCell hideBelow="sm">Stock Status</TableHeaderCell>
          <TableHeaderCell align="end">Threshold</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {drugs.map((drug, i) => {
          const isLow = drug.currentStock < drug.minimumStockThreshold;

          return (
            <TableRow key={i}>
              {/* Medication */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-110 ${
                      isLow
                        ? "bg-destructive/10 text-destructive"
                        : "bg-sidebar-primary/10 text-sidebar-primary"
                    }`}
                  >
                    <Pill size={16} />
                  </div>
                  <span className="text-sm font-semibold">
                    {drug.tradeName}
                  </span>
                </div>
              </TableCell>

              {/* Generic Name */}
              <TableCell>
                <span className="text-sm italic text-muted-foreground">
                  {drug.genericName}
                </span>
              </TableCell>

              {/* Concentration */}
              <TableCell hideBelow="sm">
                <span className="rounded-full border border-sidebar-primary/20 bg-sidebar-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-sidebar-primary">
                  {drug.concentration}
                </span>
              </TableCell>

              {/* Stock Status */}
              <TableCell hideBelow="sm">
                <StockBar
                  current={drug.currentStock}
                  threshold={drug.minimumStockThreshold}
                />
              </TableCell>

              {/* Threshold */}
              <TableCell align="end" className="ps-8">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground">
                    Min Limit
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {drug.minimumStockThreshold}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </TableShell>
  </TableCard>
);

export default DrugStockTable;
