import React, { useRef, useState } from "react";
import { Settings2, Package, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stockSettingsService } from "@/services/stockSettingsService";
import { drugKeys, stockSettingsKeys } from "@/api/keys";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";
import DrugSearchInput from "@/components/ui/DrugSearchInput";

interface SelectedDrug {
  drugId: number;
  tradeName: string;
  genericName: string;
  concentration: string | null;
  minimumStock: number;
}

const StockSettingsCard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<SelectedDrug | null>(null);
  const [minStock, setMinStock] = useState<number | "">("");
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (vars: {
      drugId: number;
      minimumStock: number;
      tradeName: string;
    }) =>
      stockSettingsService.createOrUpdate({
        drugId: vars.drugId,
        minimumStock: vars.minimumStock,
      }),
    onSuccess: (_, vars) => {
      toast.success(`Stock setting saved for ${vars.tradeName}`);
      queryClient.invalidateQueries({ queryKey: stockSettingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: drugKeys.all });

      setSelected((prev) =>
        prev && prev.drugId === vars.drugId
          ? { ...prev, minimumStock: vars.minimumStock }
          : prev,
      );
    },
    onError: handleApiError,
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: (vars: { drugId: number; tradeName: string }) =>
      stockSettingsService.delete(vars.drugId),
    onSuccess: (_, vars) => {
      toast.success(`Stock setting removed for ${vars.tradeName}`);
      queryClient.invalidateQueries({ queryKey: stockSettingsKeys.lists() });

      setSelected((prev) =>
        prev && prev.drugId === vars.drugId ? null : prev,
      );
      setMinStock((prev) =>
        selected && selected.drugId === vars.drugId ? "" : prev,
      );
    },
    onError: handleApiError,
  });

  const handleSelect = (drug: SelectedDrug) => {
    setSelected(drug);
    setMinStock(drug.minimumStock);

    setTimeout(() => {
      scrollTargetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const handleSaveTrigger = () => {
    if (!selected || minStock === "") return;
    save({
      drugId: selected.drugId,
      minimumStock: Number(minStock),
      tradeName: selected.tradeName,
    });
  };

  const handleRemoveTrigger = () => {
    if (!selected) return;
    remove({
      drugId: selected.drugId,
      tradeName: selected.tradeName,
    });
  };

  const canSave =
    selected &&
    minStock !== "" &&
    Number(minStock) >= 0 &&
    Number(minStock) !== selected.minimumStock;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="text-base font-semibold text-foreground">
            Stock Settings
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Set minimum stock alert threshold for a specific drug
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
          <Settings2 className="h-4 w-4" />
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Search */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-foreground">
            Search Drug
          </label>
          <DrugSearchInput
            placeholder="Search by trade name or generic name..."
            onSelect={handleSelect}
          />
        </div>

        {/* Selected drug */}
        {selected && (
          <div
            ref={scrollTargetRef}
            className="rounded-lg border border-sidebar-primary/20 bg-sidebar-primary/5 px-4 py-3 flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-primary">
                {selected.tradeName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 italic">
                {selected.genericName}
              </p>
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setMinStock("");
              }}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Threshold input */}
        {selected && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Minimum Stock Threshold
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                placeholder={minStock.toString()}
                value={minStock}
                onChange={(e) =>
                  setMinStock(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="flex-1 h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
              <button
                onClick={handleSaveTrigger}
                disabled={!canSave || isSaving}
                className="h-10 rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold px-5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-sidebar-primary-foreground border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />A low stock alert will trigger
              when the drug falls below this number
            </p>
          </div>
        )}

        {/* Remove setting */}
        {selected && (
          <div className="pt-2 border-t border-border">
            <button
              onClick={handleRemoveTrigger}
              disabled={isRemoving}
              className="text-sm text-destructive hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRemoving
                ? "Removing..."
                : "Remove stock setting for this drug"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSettingsCard;
