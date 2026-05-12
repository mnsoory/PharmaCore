import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { StockBatch } from "@/types/stockBatch";

const statusConfig: Record<StockBatch["status"], string> = {
  Available:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Low: "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-950   dark:text-amber-300   dark:border-amber-800",
  "Expiring Soon":
    "bg-orange-50  text-orange-700  border-orange-200  dark:bg-orange-950  dark:text-orange-300  dark:border-orange-800",
  Expired:
    "bg-red-50     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-800",
};

const columns = [
  { label: "Drug", field: "tradeName" },
  { label: "Batch No.", field: "batchNumber" },
  { label: "Qty", field: "remainingQty" },
  { label: "Expiry Date", field: "expiryDate" },
  { label: "Unit Price", field: "purchasePrice" },
  { label: "Status", field: "status" },
  { label: "Actions", field: null, align: "end" as const },
];

interface Props {
  batches: StockBatch[];
  sortField: keyof StockBatch | null;
  sortDir: "asc" | "desc";
  onSort: (field: keyof StockBatch) => void;
  onAdjust: (batch: StockBatch) => void;
}

const NOW = Date.now();

const daysUntilExpiry = (date: string) => {
  const diff = new Date(date).getTime() - NOW;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const StockBatchTable: React.FC<Props> = ({
  batches,
  sortField,
  sortDir,
  onSort,
  onAdjust,
}) => {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          {columns.map((col) => (
            <th
              key={col.label}
              onClick={() => col.field && onSort(col.field as keyof StockBatch)}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 select-none ${
                col.align === "end" ? "text-end" : "text-start"
              } ${col.field ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                {col.label}
                {col.field && (
                  <span className="inline-flex flex-col opacity-40">
                    <ChevronUp
                      className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "asc" ? "opacity-100 text-sidebar-primary" : ""}`}
                    />
                    <ChevronDown
                      className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "desc" ? "opacity-100 text-sidebar-primary" : ""}`}
                    />
                  </span>
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {batches.map((batch) => {
          const days = daysUntilExpiry(batch.expiryDate);
          const isExpired = days < 0;

          return (
            <TableRow key={batch.stockBatchId}>
              {/* Drug */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/10 text-sidebar-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground leading-tight">
                      {batch.tradeName}{" "}
                      <span className="text-sm text-muted-foreground italic mt-0.5">
                        · {batch.concentration}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground italic mt-0.5">
                      {batch.genericName}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Batch No */}
              <TableCell>
                <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
                  {batch.batchNumber}
                </span>
              </TableCell>

              {/* Qty */}
              <TableCell>
                <span className="text-base font-bold text-foreground">
                  {batch.remainingQty.toLocaleString()}
                </span>
              </TableCell>

              {/* Expiry */}
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-medium text-foreground">
                    {new Date(batch.expiryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`text-xs font-medium ${isExpired ? "text-destructive" : days <= 30 ? "text-orange-500" : "text-muted-foreground"}`}
                  >
                    {isExpired
                      ? `Expired ${Math.abs(days)}d ago`
                      : `${days}d remaining`}
                  </span>
                </div>
              </TableCell>

              {/* Price */}
              <TableCell>
                <span className="text-base font-semibold text-foreground">
                  ${batch.purchasePrice.toFixed(2)}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${statusConfig[batch.status]}`}
                >
                  {batch.status}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell align="end">
                <div className="relative group/tip">
                  <button
                    onClick={() => onAdjust(batch)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                      Adjust Stock
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </TableShell>
  );
};

export default StockBatchTable;
