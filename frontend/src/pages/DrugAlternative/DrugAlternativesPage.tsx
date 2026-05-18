import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import DrugSearchInput from "@/components/ui/DrugSearchInput";
import AlternativesCard from "./components/AlternativesCard";
import type { DrugWithAlternatives } from "../../types/drugAlternative";
import { handleApiError } from "@/utils/errorHandler";
import { drugAlternativeService } from "@/services/drugAlternativeService";
import { toast } from "sonner";

const DrugAlternativesPage: React.FC = () => {
  const [selectedDrug, setSelectedDrug] = useState<DrugWithAlternatives | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [isAdding,   setIsAdding]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectDrug = async (drug: {
    drugId: number;
    tradeName: string;
    genericName: string;
    concentration?: string | null;
  }) => {
    setLoading(true);
    setSelectedDrug(null);
    try {
      const data = await drugAlternativeService.getByDrugId(drug.drugId);
      setSelectedDrug(data);
    } catch {
      setSelectedDrug({
        drugId:        drug.drugId,
        tradeName:     drug.tradeName,
        genericName:   drug.genericName,
        concentration: drug.concentration ?? "",
        alternatives:  [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlternative = async (drugId: number, alternativeDrugId: number) => {
    setIsAdding(true);
    try {
      await drugAlternativeService.create({ drugId, alternativeDrugId });
      toast.success("Alternative added successfully");
      const data = await drugAlternativeService.getByDrugId(drugId);
      setSelectedDrug(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAlternative = async (drugId: number, alternativeId: number) => {
    setIsDeleting(true);
    try {
      await drugAlternativeService.delete(drugId, alternativeId);
      toast.success("Alternative removed successfully");
      setSelectedDrug(prev =>
        prev ? {
          ...prev,
          alternatives: prev.alternatives.filter(a => a.id !== alternativeId),
        } : prev
      );
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Drug Alternatives</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search for a drug to view and manage its alternatives
        </p>
      </div>

      {/* Search card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />
        <div className="px-6 py-5">
          <p className="text-sm font-medium text-foreground mb-3">Search Drug</p>
          <DrugSearchInput
            placeholder="Search by trade name or generic name..."
            onSelect={handleSelectDrug}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full border-2 border-sidebar-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sidebar-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading alternatives...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !selectedDrug && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
            <ArrowLeftRight className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-base font-medium text-muted-foreground">No drug selected</p>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center">
            Search for a drug above to view and manage its therapeutic alternatives
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && selectedDrug && (
        <AlternativesCard
          data={selectedDrug}
          isAdding={isAdding}
          isDeleting={isDeleting}
          onAddAlternative={handleAddAlternative}
          onDeleteAlternative={handleDeleteAlternative}
        />
      )}
    </div>
  );
};

export default DrugAlternativesPage;