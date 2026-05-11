import React from "react";
import { ChevronUp, ChevronDown, Eye, RefreshCw } from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { PurchaseOrder } from "@/types/purchaseOrder";

const statusConfig: Record<string, string> = {
  "Pending":   "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-950   dark:text-amber-300   dark:border-amber-800",
  "PartiallyReceived":  "bg-blue-50    text-blue-700    border-blue-200    dark:bg-blue-950    dark:text-blue-300    dark:border-blue-800",
  "Completed":  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  "Cancelled": "bg-red-50     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-800",
};

interface Props {
  orders: PurchaseOrder[];
  sortField: keyof PurchaseOrder | null;
  sortDir: "asc" | "desc";
  onSort: (f: keyof PurchaseOrder) => void;
  onView: (order: PurchaseOrder) => void;
  onUpdateStatus: (order: PurchaseOrder) => void;
}

const columns: { label: string; field: keyof PurchaseOrder | null; align?: "end" }[] = [
  { label: "Order ID",   field: "purchaseOrderId" },
  { label: "Supplier",   field: "supplierName"    },
  { label: "Created By", field: "userName"        },
  { label: "Date",       field: "orderDate"       },
  { label: "Items",      field: null              },
  { label: "Total",      field: null              },
  { label: "Status",     field: "status"          },
  { label: "Actions",    field: null, align: "end"},
];

const PurchaseOrderTable: React.FC<Props> = ({
  orders, sortField, sortDir, onSort, onView, onUpdateStatus,
}) => (
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
      {orders.map(order => {
        const total = order.items.reduce((sum, i) => sum + i.totalPrice, 0);
        const canUpdate = order.status === "Pending" || order.status === "PartiallyReceived";

        return (
          <TableRow key={order.purchaseOrderId}>

            {/* Order ID */}
            <TableCell>
              <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
                #{order.purchaseOrderId}
              </span>
            </TableCell>

            {/* Supplier */}
            <TableCell>
              <div>
                <p className="text-base font-semibold text-foreground">{order.supplierName}</p>
              </div>
            </TableCell>

            {/* Created by */}
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-[10px] font-bold text-sidebar-primary">
                  {order.userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm text-muted-foreground">{order.userName}</span>
              </div>
            </TableCell>

            {/* Date */}
            <TableCell>
              <span className="text-sm text-foreground">
                {new Date(order.orderDate).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </span>
            </TableCell>

            {/* Items count */}
            <TableCell>
              <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-muted-foreground">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </span>
            </TableCell>

            {/* Total */}
            <TableCell>
              <span className="text-base font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </TableCell>

            {/* Status */}
            <TableCell>
              <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${statusConfig[order.status]}`}>
                {order.status}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell align="end">
              <div className="flex justify-end gap-1">
                {/* View */}
                <div className="relative group/tip">
                  <button
                    onClick={() => onView(order)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">View Details</div>
                  </div>
                </div>

                {/* Update status */}
                {canUpdate && (
                  <div className="relative group/tip">
                    <button
                      onClick={() => onUpdateStatus(order)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                      <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">Update Status</div>
                    </div>
                  </div>
                )}
              </div>
            </TableCell>

          </TableRow>
        );
      })}
    </tbody>
  </TableShell>
);

export default PurchaseOrderTable;