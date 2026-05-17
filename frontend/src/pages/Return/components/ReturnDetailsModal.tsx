import React from "react";
import { X, Package, RotateCcw } from "lucide-react";
import type { SaleCancellation } from "@/types/return";

interface Props {
  cancellation: SaleCancellation;
  onClose: () => void;
}

const ReturnDetailsModal: React.FC<Props> = ({ cancellation, onClose }) => {
  const { sale } = cancellation;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-120 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Return #{cancellation.saleCancellationId}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                For Sale #{cancellation.saleId}
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
        <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-border shrink-0">
          {[
            { label: "Cancelled By",      value: cancellation.cancelledBy  },
            { label: "Payment",      value: sale.paymentMethod },
            { label: "Sale Date",    value: new Date(sale.saleDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
            { label: "Cancelled At", value: new Date(cancellation.cancelledAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Return Reason
          </p>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-foreground">{cancellation.reason}</p>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Returned Items ({sale.saleItems.length})
          </p>
          <div className="space-y-2">
            {sale.saleItems.map(item => (
              <div key={item.saleItemId} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.drugName} <span className="text-sm text-muted-foreground italic">{item.concentration}</span></p>
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
              <span className="text-sm text-muted-foreground">Discount</span>
              <span className="text-sm font-semibold text-amber-600">-{sale.discount}%</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Refunded Amount</span>
            <span className="text-xl font-bold text-destructive">-${sale.totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReturnDetailsModal;