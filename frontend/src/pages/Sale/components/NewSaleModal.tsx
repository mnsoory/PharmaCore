import React, { useState } from "react";
import { X, Trash2, Tag, Package } from "lucide-react";
import type { CreateSalePayload } from "@/types/sale";
import StockBatchSearchInput from "@/components/ui/StockBatchSearchInput";
import { toast } from "sonner";

interface SelectedItem {
  batchId: number;
  drugName: string;
  batchNumber: string;
  availableQty: number;
  unitPrice: number;
  expiryDate: string;
  quantity: number;
}

interface Props {
  onClose: () => void;
  onSubmit: (payload: CreateSalePayload) => void;
  isSubmitting: boolean;
}

const NewSaleModal: React.FC<Props> = ({ onClose, onSubmit, isSubmitting }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const updateQty = (batchId: number, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.batchId === batchId ? { ...i, quantity: qty } : i)),
    );
  };

  const removeItem = (batchId: number) =>
    setSelectedItems((prev) => prev.filter((i) => i.batchId !== batchId));

  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0,
  );
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    onSubmit({
      saleItems: selectedItems.map((i) => ({
        batchId: i.batchId,
        quantity: i.quantity,
      })),
      discount,
      paymentMethod,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-135 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              New Sale
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Search and add drugs to the transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Drug search */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Add Drug
              </label>
              <StockBatchSearchInput
                placeholder="Search by drug name or batch number..."
                excludeIds={selectedItems.map((i) => i.batchId)}
                onSelect={(batch) => {
                  if (batch.availableQuantity <= 0) {
                    toast.error("This batch is out of stock");
                    return;
                  }
                  if (selectedItems.some((i) => i.batchId === batch.batchId))
                    return;
                  setSelectedItems((prev) => [
                    ...prev,
                    {
                      batchId: batch.batchId,
                      drugName: batch.drugName,
                      batchNumber: batch.batchNumber,
                      availableQty: batch.availableQuantity,
                      unitPrice: batch.unitPrice,
                      expiryDate: batch.expiryDate,
                      quantity: 1,
                    },
                  ]);
                }}
              />
            </div>

            {/* Selected items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Selected Items
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({selectedItems.length}{" "}
                    {selectedItems.length === 1 ? "item" : "items"})
                  </span>
                </p>

                {selectedItems.map((item) => (
                  <div
                    key={item.batchId}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                      <Package className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.drugName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Batch: {item.batchNumber} · ${item.unitPrice.toFixed(2)}
                        /unit
                      </p>
                      <p
                        className={`text-xs mt-0.5 font-medium text-muted-foreground`}
                      >
                        Expires:{" "}
                        {new Date(item.expiryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Available: {item.availableQty} units
                      </p>
                    </div>

                    {/* Quantity input */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.batchId,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.availableQty}
                        value={Math.min(item.quantity, item.availableQty)}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          updateQty(item.batchId, newValue);
                        }}
                        className="h-7 w-14 rounded-md border border-input bg-background px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 transition-[color,box-shadow]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.batchId,
                            Math.min(item.availableQty, item.quantity + 1),
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-bold text-foreground shrink-0 w-16 text-end">
                      $
                      {(
                        Math.min(item.availableQty, item.quantity) *
                        item.unitPrice
                      ).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.batchId)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {selectedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 gap-2">
                <Package className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No items added yet
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Search for a drug above to add it
                </p>
              </div>
            )}

            {/* Payment Method */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Payment Method
              </label>
              <div className="flex gap-1.5">
                {["Cash", "Wallet", "Card", "Insurance"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 h-9 rounded-md border text-xs font-semibold transition-all ${
                      paymentMethod === m
                        ? "border-ring bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Discount (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
            </div>

            {/* Totals */}
            {selectedItems.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Discount ({discount}%)
                    </span>
                    <span className="text-sm font-semibold text-amber-600">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-medium text-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-5 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedItems.length === 0 || isSubmitting}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Completing...
                </span>
              ) : (
                "Complete Sale"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSaleModal;
