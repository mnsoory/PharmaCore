import React from "react";
import { ChevronUp, ChevronDown, Eye } from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { SaleCancellation } from "@/types/return";

interface Props {
  cancellations: SaleCancellation[];
  sortField: keyof SaleCancellation | null;
  sortDir: "asc" | "desc";
  onSort: (f: keyof SaleCancellation) => void;
  onView: (c: SaleCancellation) => void;
}

const columns: { label: string; field: keyof SaleCancellation | null; align?: "end" }[] = [
  { label: "Return ID",    field: "saleCancellationId" },
  { label: "Sale ID",      field: "saleId"             },
  { label: "Cancelled By",      field: null                 },
  { label: "Reason",       field: "reason"             },
  { label: "Cancelled At", field: "cancelledAt"        },
  { label: "Amount",       field: null                 },
  { label: "Actions",      field: null, align: "end"   },
];

const ReturnsTable: React.FC<Props> = ({ cancellations, sortField, sortDir, onSort, onView }) => (
  <TableShell>
    <thead>
      <tr className="border-b border-border">
        {columns.map(col => (
          <th
            key={col.label}
            onClick={() => col.field && onSort(col.field)}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 select-none ${
              col.align === "end" ? "text-end" : "text-start"
            } ${col.field ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
          >
            <span className="inline-flex items-center gap-1">
              {col.label}
              {col.field && (
                <span className="inline-flex flex-col opacity-40">
                  <ChevronUp   className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "asc"  ? "opacity-100 text-sidebar-primary" : ""}`} />
                  <ChevronDown className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "desc" ? "opacity-100 text-sidebar-primary" : ""}`} />
                </span>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {cancellations.map(c => (
        <TableRow key={c.saleCancellationId}>

          {/* Return ID */}
          <TableCell>
            <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
              #{c.saleCancellationId}
            </span>
          </TableCell>

          {/* Sale ID */}
          <TableCell>
            <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
              #{c.saleId}
            </span>
          </TableCell>

          {/* Cashier */}
          <TableCell>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-[10px] font-bold text-sidebar-primary">
                {c.cancelledBy.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-foreground">{c.cancelledBy}</span>
            </div>
          </TableCell>

          {/* Reason */}
          <TableCell>
            <span className="text-sm text-foreground max-w-45 truncate block" title={c.reason}>
              {c.reason}
            </span>
          </TableCell>

          {/* Cancelled At */}
          <TableCell>
            <div className="flex flex-col">
              <span className="text-sm text-foreground">
                {new Date(c.cancelledAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(c.cancelledAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </TableCell>

          {/* Amount */}
          <TableCell>
            <span className="text-base font-bold text-destructive">
              -${c.sale.totalAmount.toFixed(2)}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell align="end">
            <div className="relative group/tip">
              <button
                onClick={() => onView(c)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
              >
                <Eye className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                  View Details
                </div>
              </div>
            </div>
          </TableCell>

        </TableRow>
      ))}
    </tbody>
  </TableShell>
);

export default ReturnsTable;