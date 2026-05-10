import React, { useState } from "react";
import {
  X,
  Pill,
  Factory,
  Layers,
  FlaskConical,
  Package,
  TrendingDown,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import type { Drug } from "@/types/inventory";

const statusConfig: Record<Drug["status"], string> = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  "Low Stock":
    "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-950   dark:text-amber-300   dark:border-amber-800",
  "Out of Stock":
    "bg-red-50     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-800",
};

interface Props {
  drug: Drug;
  onClose: () => void;
  onEdit: (drug: Drug) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const DrugDetailsModal: React.FC<Props> = ({
  drug,
  onClose,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const stockPct = Math.min(
    100,
    Math.round((drug.totalAvailableStock / (drug.minimumStock * 5)) * 100),
  );

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-background shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {drug.tradeName}
              </h2>
              <p className="text-xs italic text-muted-foreground mt-0.5">
                {drug.genericName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${statusConfig[drug.status]}`}
            >
              {drug.status}
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Factory,
                label: "Manufacturer",
                value: drug.manufacturer,
              },
              { icon: Layers, label: "Category", value: drug.category },
              { icon: FlaskConical, label: "Form", value: drug.form },
              {
                icon: Package,
                label: "Concentration",
                value: drug.concentration,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Stock info */}
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" /> Stock Level
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {drug.totalAvailableStock.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Min. stock: {drug.minimumStock}
                </p>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Avg. price:{" "}
                <span className="text-foreground">
                  ${drug.averagePurchasePrice.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  drug.status === "Safe"
                    ? "bg-success"
                    : drug.status === "Low Stock"
                      ? "bg-warning"
                      : "bg-destructive"
                }`}
                style={{ width: `${stockPct}%` }}
              />
            </div>
          </div>

          {/* Prescription */}
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              drug.requiresPrescription
                ? "border-primary/20 bg-primary/5"
                : "border-border bg-muted/20"
            }`}
          >
            {drug.requiresPrescription ? (
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            ) : (
              <ShieldOff className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {drug.requiresPrescription
                  ? "Prescription Required"
                  : "No Prescription Required"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {drug.requiresPrescription
                  ? "This medication requires a doctor's prescription"
                  : "This medication is available over the counter"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                onEdit(drug);
                onClose();
              }}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Edit Drug
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="h-10 px-4 rounded-md border border-destructive/30 bg-destructive/5 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-all"
              >
                Delete
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-10 px-3 rounded-md border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDelete(drug.id)}
                  disabled={isDeleting}
                  className="h-10 px-4 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                      Deleting...
                    </span>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugDetailsModal;
