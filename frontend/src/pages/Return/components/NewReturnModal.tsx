import React, { useState } from "react";
import { X, Search, RotateCcw, Package, AlertCircle } from "lucide-react";
import type { CreateCancellationPayload } from "@/types/return";
import type { Sale } from "@/types/sale";
import { saleService } from "@/services/saleService";

const reasons = [
  "Customer request",
  "Wrong medication dispensed",
  "Damaged product",
  "Duplicate sale",
  "Other",
];

interface Props {
  onClose: () => void;
  onSubmit: (payload: CreateCancellationPayload) => void;
  isCancelling: boolean;
}

const NewReturnModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  isCancelling,
}) => {
  const [saleIdInput, setSaleIdInput] = useState("");
  const [foundSale, setFoundSale] = useState<Sale | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [customReason, setCustomReason] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const id = Number(saleIdInput);
    if (!id) return;
    setIsSearching(true);
    try {
      const sale = await saleService.getById(id);
      setFoundSale(sale);
      setNotFound(false);
    } catch {
      setFoundSale(null);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundSale) return;
    onSubmit({
      saleId: foundSale.saleId,
      reason: reason === "Other" ? customReason : reason,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-125 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              New Return
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Search for a sale to cancel and refund
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
            {/* Sale ID search */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Sale ID
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Enter sale ID..."
                  value={saleIdInput}
                  onChange={(e) => {
                    setSaleIdInput(e.target.value);
                    setFoundSale(null);
                    setNotFound(false);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleSearch())
                  }
                  className="flex-1 h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex h-10 items-center gap-2 rounded-md bg-sidebar-primary px-4 text-sm font-semibold text-sidebar-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>

            {isSearching ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-6 w-6 mt-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                
              </span>
            ) : (
              <>
                {/* Not found */}
                {notFound && (
                  <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">
                      No sale found with ID #{saleIdInput}
                    </p>
                  </div>
                )}

                {/* Found sale preview */}
                {foundSale && (
                  <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                    {/* Sale header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                          #{foundSale.saleId}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {foundSale.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(foundSale.saleDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          ${foundSale.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-4 py-3 space-y-2">
                      {foundSale.saleItems.map((item) => (
                        <div
                          key={item.saleItemId}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                            <Package className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.drugName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ${item.unitPrice.toFixed(2)} ·
                              Batch: {item.batchNumber}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            ${item.subTotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Refund summary */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        Refund Amount
                      </span>
                      <span className="text-base font-bold text-destructive">
                        -${foundSale.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Reason */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Return Reason
              </label>
              <div className="flex flex-wrap gap-2">
                {reasons.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`h-8 rounded-lg border px-3 text-sm font-medium transition-all ${
                      reason === r
                        ? "border-ring bg-primary text-primary-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {reason === "Other" && (
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none placeholder:text-muted-foreground transition-[color,box-shadow]"
                />
              )}
            </div>
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
              disabled={
                !foundSale ||
                isCancelling ||
                (reason === "Other" && !customReason.trim())
              }
              className="flex-1 h-10 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                  Returning...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Confirm Return
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReturnModal;
