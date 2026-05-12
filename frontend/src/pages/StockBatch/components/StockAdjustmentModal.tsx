import React, { useState } from "react";
import { X } from "lucide-react";
import type {
  StockBatch,
  StockAdjustmentPayload,
  StockAdjustmentType,
} from "@/types/stockBatch";
import { toBackendAdjustmentType } from "@/types/stockBatch";

interface Props {
  batch: StockBatch;
  onClose: () => void;
  onSubmit: (adjustment: StockAdjustmentPayload) => void;
  isSubmitting: boolean;
}

const adjustmentTypes: {
  value: StockAdjustmentType;
  label: string;
  isAdd: boolean;
}[] = [
  { value: "addition", label: "Addition", isAdd: true },
  { value: "returnFromCustomer", label: "Return from Customer", isAdd: true },
  { value: "correction", label: "Stock Correction", isAdd: false },
  { value: "deduction", label: "Deduction", isAdd: false },
  { value: "damage", label: "Damaged Goods", isAdd: false },
  { value: "expired", label: "Expired Stock", isAdd: false },
  { value: "returnToSupplier", label: "Return to Supplier", isAdd: false },
];

const getDefaultReason = (type: StockAdjustmentType): string => {
  switch (type) {
    case "addition":           return "Stock Addition";
    case "returnFromCustomer": return "Return from Customer";
    case "correction":         return "Stock Correction";
    case "deduction":          return "Stock Deduction";
    case "damage":             return "Damaged Goods";
    case "expired":            return "Expired Stock";
    case "returnToSupplier":   return "Return to Supplier";
    default:                   return "Stock Adjustment";
  }
};

const StockAdjustmentModal: React.FC<Props> = ({
  batch,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<StockAdjustmentType>("addition");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const selected = adjustmentTypes.find((t) => t.value === adjustmentType)!;
  const isAdd = selected.isAdd;

  const currentQty = batch.remainingQty;
  const newQty = isAdd
    ? currentQty + quantity
    : Math.max(0, currentQty - quantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      stockBatchId: batch.stockBatchId,
      quantity,
      reason: note.trim() || getDefaultReason(adjustmentType),
      adjustmentType: toBackendAdjustmentType(adjustmentType),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">Stock Adjustment</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {batch.tradeName} — Batch {batch.batchNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Stock */}
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="text-lg font-bold text-foreground">
              {currentQty.toLocaleString()} units
            </span>
          </div>

          {/* Adjustment Type */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-2">
              {adjustmentTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setAdjustmentType(t.value)}
                  className={`h-10 rounded-md border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    adjustmentType === t.value
                      ? t.isAdd
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "border-destructive/40 bg-destructive/5 text-destructive"
                      : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <input
              type="number"
              min={1}
              max={!isAdd ? currentQty : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
            <p className="text-xs text-muted-foreground">
              New quantity after adjustment:{" "}
              <span
                className={`font-semibold ${
                  newQty > currentQty
                    ? "text-emerald-600 dark:text-emerald-400"
                    : newQty < currentQty
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {newQty.toLocaleString()} units
                {newQty > currentQty && " ↑"}
                {newQty < currentQty && " ↓"}
              </span>
            </p>
          </div>

          {/* Reason */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Reason <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Enter the reason for this adjustment..."
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none placeholder:text-muted-foreground transition-[color,box-shadow]"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </span>
              ) : (
                "Confirm Adjustment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;