import React, { useState } from "react";
import { X, Trash2, Building2, Package } from "lucide-react";
import type {
  CreateOrderPayload,
  CreateOrderItem,
} from "@/types/purchaseOrder";
import DrugSearchInput from "@/components/ui/DrugSearchInput";
import SupplierSearchInput from "@/components/ui/SupplierSearchInput";

interface SelectedSupplier {
  supplierId: number;
  name: string;
  company: string;
}

interface SelectedItem extends CreateOrderItem {
  drugName: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (payload: CreateOrderPayload) => void;
  isSubmitting?: boolean;
}

const CreateOrderModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [selectedSupplier, setSelectedSupplier] =
    useState<SelectedSupplier | null>(null);
  const [items, setItems] = useState<SelectedItem[]>([]);

  const addItem = (drug: { drugId: number; tradeName: string }) => {
    if (items.some((i) => i.drugId === drug.drugId)) return;
    setItems((p) => [
      ...p,
      {
        drugId: drug.drugId,
        drugName: drug.tradeName,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (drugId: number) =>
    setItems((p) => p.filter((i) => i.drugId !== drugId));

  const updateItem = (
    drugId: number,
    field: "quantity" | "unitPrice",
    value: number,
  ) =>
    setItems((p) =>
      p.map((i) => (i.drugId === drugId ? { ...i, [field]: value } : i)),
    );

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const canSubmit =
    selectedSupplier &&
    items.length > 0 &&
    items.every((i) => i.quantity > 0 && i.unitPrice > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      supplierId: selectedSupplier!.supplierId,
      items: items.map(({ drugId, quantity, unitPrice }) => ({
        drugId,
        quantity,
        unitPrice,
      })),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              New Purchase Order
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select a supplier and add drugs to order
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
            {/* Supplier search */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Supplier
              </label>
              <SupplierSearchInput
                placeholder="Search supplier by name or company..."
                onSelect={(s) => setSelectedSupplier(s)}
              />
              {selectedSupplier && (
                <div className="flex items-center gap-2 rounded-md border border-sidebar-primary/20 bg-sidebar-primary/5 px-3 py-2">
                  <Building2 className="h-3.5 w-3.5 text-sidebar-primary shrink-0" />
                  <span className="text-xs font-medium text-sidebar-primary">
                    {selectedSupplier.name} — {selectedSupplier.company}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSupplier(null)}
                    className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Drug search */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Add Drug
              </label>
              <DrugSearchInput
                placeholder="Search drug by trade name..."
                excludeIds={items.map((i) => i.drugId)}
                onSelect={(drug) => addItem(drug)}
              />
            </div>

            {/* Items list */}
            {items.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order Items ({items.length})
                </p>
                {items.map((item) => (
                  <div
                    key={item.drugId}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                      <Package className="h-4 w-4" />
                    </div>

                    <p className="flex-1 text-sm font-semibold text-foreground truncate min-w-0">
                      {item.drugName}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-xs text-muted-foreground">
                        Qty:
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.drugId,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 transition-[color,box-shadow]"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-xs text-muted-foreground">
                        Price:
                      </label>
                      <input
                        type="number"
                        required
                        min={0.01}
                        step={0.01}
                        placeholder="0.00"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          updateItem(
                            item.drugId,
                            "unitPrice",
                            Number(e.target.value),
                          )
                        }
                        className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 transition-[color,box-shadow]"
                      />
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-bold text-foreground shrink-0 w-16 text-end">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.drugId)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 && (
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

            {/* Total */}
            {items.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Order Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${total.toFixed(2)}
                </span>
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
              disabled={!canSubmit || isSubmitting}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Creating...
                </span>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
