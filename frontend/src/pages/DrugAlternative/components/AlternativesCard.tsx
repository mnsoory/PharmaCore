import React, { useState } from "react";
import { Pill, Trash2, Plus, ArrowLeftRight, Loader2 } from "lucide-react";
import DrugSearchInput from "@/components/ui/DrugSearchInput";
import type { DrugWithAlternatives } from "../../../types/drugAlternative";

interface Props {
  data:                DrugWithAlternatives;
  isAdding:            boolean;
  isDeleting:          boolean;
  onAddAlternative:    (drugId: number, alternativeDrugId: number) => void;
  onDeleteAlternative: (drugId: number, alternativeDrugId: number) => void;
}

const AlternativesCard: React.FC<Props> = ({
  data, isAdding, isDeleting, onAddAlternative, onDeleteAlternative,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const excludeIds = [data.drugId, ...data.alternatives.map(a => a.id)];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      {/* Drug info header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/10 text-sidebar-primary">
          <Pill className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">
            {data.tradeName}{" "}
            {data.concentration && (
              <span className="text-sm font-normal text-muted-foreground italic">
                {data.concentration}
              </span>
            )}
          </p>
          <p className="text-sm italic text-muted-foreground mt-0.5">{data.genericName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-medium text-muted-foreground">
            {data.alternatives.length} {data.alternatives.length === 1 ? "alternative" : "alternatives"}
          </span>
          <button
            onClick={() => setShowAddForm(p => !p)}
            disabled={isAdding}
            className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-all ${
              showAddForm
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Plus className={`h-4 w-4 transition-transform ${showAddForm ? "rotate-45" : ""}`} />
            {showAddForm ? "Cancel" : "Add Alternative"}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <p className="text-sm font-medium text-foreground mb-3">
            Search for a drug to add as alternative
          </p>
          <DrugSearchInput
            placeholder="Search alternative drug..."
            excludeIds={excludeIds}
            onSelect={drug => {
              onAddAlternative(data.drugId, drug.drugId);
              setShowAddForm(false);
            }}
          />
        </div>
      )}

      {/* List */}
      <div className="px-6 py-4">
        {data.alternatives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <ArrowLeftRight className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No alternatives added yet</p>
            <p className="text-xs text-muted-foreground/60">
              Click "Add Alternative" to link drugs with the same active ingredient
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.alternatives.map(alt => (
              <div
                key={alt.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground">
                    {alt.tradeName}{" "}
                    {alt.concentration && (
                      <span className="text-sm font-normal text-muted-foreground italic">
                        {alt.concentration}
                      </span>
                    )}
                  </p>
                  <p className="text-sm italic text-muted-foreground mt-0.5">{alt.genericName}</p>
                </div>

                <div className="relative group/tip">
                  <button
                    onClick={() => onDeleteAlternative(data.drugId, alt.id)}
                    disabled={isDeleting}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed"
                  >
                    {isDeleting
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2  className="h-4 w-4" />
                    }
                  </button>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                      Remove Alternative
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlternativesCard;