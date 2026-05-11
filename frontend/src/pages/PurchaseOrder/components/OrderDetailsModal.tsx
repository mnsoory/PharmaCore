import React from "react";
import { X, Package } from "lucide-react";
import type { PurchaseOrder } from "@/types/purchaseOrder";

const statusConfig: Record<string, string> = {
  "Pending":   "bg-amber-50   text-amber-700   border-amber-200",
  "Approved":  "bg-blue-50    text-blue-700    border-blue-200",
  "Received":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cancelled": "bg-red-50     text-red-700     border-red-200",
};

interface Props {
  order: PurchaseOrder;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  const total = order.items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-140 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Order #{order.purchaseOrderId}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {order.supplierName} · {new Date(order.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${statusConfig[order.status]}`}>
              {order.status}
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-border shrink-0">
          {[
            { label: "Created By", value: order.userName },
            { label: "Supplier",   value: order.supplierName },
            { label: "Order Date", value: new Date(order.orderDate).toLocaleDateString("en-GB") },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Order Items ({order.items.length})
          </p>
          <div className="space-y-2">
            {order.items.map(item => (
              <div
                key={item.purchaseOrderItemId}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.drugName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.quantity} units × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer total */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
          <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;