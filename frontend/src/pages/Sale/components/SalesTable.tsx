import React from "react";
import { ChevronUp, ChevronDown, Eye, ShoppingBag } from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { Sale } from "@/types/sale";

interface Props {
  sales: Sale[];
  showUser?: boolean;
  sortField: keyof Sale | null;
  sortDir: "asc" | "desc";
  onSort: (f: keyof Sale) => void;
  onView: (sale: Sale) => void;
}

const SalesTable: React.FC<Props> = ({ sales, showUser = true, sortField, sortDir, onSort, onView }) => {
  const columns = [
    { label: "Sale ID",  field: "saleId"        },
    ...(showUser ? [{ label: "Processed By", field: "username" as keyof Sale }] : []),
    { label: "Date",     field: "saleDate"      },
    { label: "Items",    field: null            },
    { label: "Discount", field: "discount"      },
    { label: "Payment",  field: "paymentMethod" },
    { label: "Total",    field: "totalAmount"   },
    { label: "Actions",  field: null, align: "end" as const },
  ];

  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          {columns.map(col => (
            <th
              key={col.label}
              onClick={() => col.field && onSort(col.field as keyof Sale)}
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
        {sales.map(sale => (
          <TableRow key={sale.saleId}>

            {/* Sale ID */}
            <TableCell>
              <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
                #{sale.saleId}
              </span>
            </TableCell>

            {/* Cashier */}
            {showUser && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-[10px] font-bold text-sidebar-primary">
                    {sale.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-foreground">{sale.username}</span>
                </div>
              </TableCell>
            )}

            {/* Date */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm text-foreground">
                  {new Date(sale.saleDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(sale.saleDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </TableCell>

            {/* Items */}
            <TableCell>
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{sale.saleItems.length}</span>
              </div>
            </TableCell>

            {/* Discount */}
            <TableCell>
              {sale.discount > 0 ? (
                <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  -{sale.discount}%
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </TableCell>

            {/* Payment */}
            <TableCell>
              <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-muted-foreground">
                {sale.paymentMethod}
              </span>
            </TableCell>

            {/* Total */}
            <TableCell>
              <span className="text-base font-bold text-foreground">${sale.totalAmount.toFixed(2)}</span>
            </TableCell>

            {/* Actions */}
            <TableCell align="end">
              <div className="relative group/tip">
                <button
                  onClick={() => onView(sale)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">View Details</div>
                </div>
              </div>
            </TableCell>

          </TableRow>
        ))}
      </tbody>
    </TableShell>
  );
};

export default SalesTable;