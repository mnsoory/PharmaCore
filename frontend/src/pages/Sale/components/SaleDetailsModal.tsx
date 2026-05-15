import React from "react";
import { X, Package, Receipt, Tag } from "lucide-react";
import type { Sale } from "@/types/sale";

interface Props {
  sale: Sale;
  onClose: () => void;
}

const SaleDetailsModal: React.FC<Props> = ({ sale, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-120 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Sale #{sale.saleId}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date(sale.saleDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              {" · "}
              {new Date(sale.saleDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-border shrink-0">
        {[
          { label: "Processed By",  value: sale.username      },
          { label: "Payment",  value: sale.paymentMethod },
          { label: "Discount", value: sale.discount > 0 ? `${sale.discount}%` : "None" },
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
          Items ({sale.saleItems.length})
        </p>
        <div className="space-y-2">
          {sale.saleItems.map(item => (
            <div key={item.saleItemId} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.drugName} {item.concentration}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Batch: {item.batchNumber} · {item.quantity} × ${item.unitPrice.toFixed(2)}
                </p>
              </div>
              <span className="text-sm font-bold text-foreground shrink-0">
                ${item.subTotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="px-6 py-4 border-t border-border shrink-0 space-y-2">
        {sale.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Discount Applied
            </span>
            <span className="text-sm font-semibold text-amber-600">-{sale.discount}%</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
          <span className="text-xl font-bold text-foreground">${sale.totalAmount.toFixed(2)}</span>
        </div>
      </div>

    </div>
  </div>
);

export default SaleDetailsModal;