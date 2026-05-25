import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import StockBatchStatCards from "./components/StockBatchStatCards";
import StockBatchToolbar from "./components/StockBatchToolbar";
import StockBatchTable from "./components/StockBatchTable";
import StockAdjustmentModal from "./components/StockAdjustmentModal";
import { stockBatchKeys } from "@/api/keys";
import { stockBatchService } from "@/services/stockBatchService";
import { stockAdjustmentService } from "@/services/stockAdjustmentService";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { checkLowStock } from "@/hooks/useNotificationChecker";
import { useNotificationStore } from "@/store/useNotificationStore";
import type {
  StockBatch,
  StockAdjustmentPayload,
  BatchFilter,
} from "@/types/stockBatch";
import { handleApiError } from "@/utils/errorHandler";

const StockBatchesPage = () => {
  const {
    data: stockBatches,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: stockBatchKeys.lists(),
    queryFn: () => stockBatchService.getAll(),
  });

  const [sortField, setSortField] = useState<keyof StockBatch | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const activeFilter = (searchParams.get("filter") as BatchFilter) ?? "all";

  const { addNotifications, settings } = useNotificationStore();

  const handleSearchChange = (newValue: string) => {
    setSearchParams((prev) => {
      if (newValue) prev.set("search", newValue);
      else prev.delete("search");
      return prev;
    });
  };

  const handleFilterChange = (newFilter: BatchFilter) => {
    setSearchParams((prev) => {
      if (newFilter && newFilter !== "all") prev.set("filter", newFilter);
      else prev.delete("filter");
      return prev;
    });
  };

  const handleSort = (field: keyof StockBatch) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleAdjustment = async (adjustment: StockAdjustmentPayload) => {
    setIsCreating(true);
    console.log("adj:", adjustment);
    try {
      const newAdjustment = await stockAdjustmentService.create(adjustment);
      toast.success(
        `Adjustment completed successfully! (#${newAdjustment.stockAdjustmentId})`,
        {
          description: `${adjustment.adjustmentType} - ${adjustment.quantity} units`,
        },
      );
      setSelectedBatch(null);
      const isAddition = ["addition", "returnFromCustomer"].includes(
        adjustment.adjustmentType,
      );
      if (!isAddition) checkLowStock(addNotifications, settings.lowStock);
      queryClient.invalidateQueries({ queryKey: stockBatchKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: stockBatchKeys.detail(adjustment.stockBatchId),
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = useMemo(() => {
    if (!stockBatches) return [];
    let result = stockBatches.filter((b) => {
      const matchSearch =
        b.tradeName.toLowerCase().includes(search.toLowerCase()) ||
        b.genericName.toLowerCase().includes(search.toLowerCase()) ||
        b.batchNumber.toLowerCase().includes(search.toLowerCase());

      const matchFilter = (() => {
        if (activeFilter === "all") return true;
        if (activeFilter === "safe") return b.status === "Safe";
        if (activeFilter === "expiring-soon")
          return b.status === "Expiring Soon";
        if (activeFilter === "expired") return b.status === "Expired";
        return true;
      })();

      return matchSearch && matchFilter;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField],
          bv = b[sortField];
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      });
    }

    return result;
  }, [stockBatches, search, activeFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    console.log("batches:", stockBatches);
    if (!stockBatches) {
      return {
        total: 0,
        expiringSoon: 0,
        expired: 0,
        available: 0,
      };
    }

    return {
      total: stockBatches.length,
      expiringSoon: stockBatches.filter((b) => b.status === "Expiring Soon")
        .length,
      expired: stockBatches.filter((b) => b.status === "Expired").length,
      available: stockBatches.filter(
        (b) => b.status !== "Expired" && b.remainingQty > 0,
      ).length,
    };
  }, [stockBatches]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !stockBatches)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      <StockBatchStatCards {...stats} />

      <TableCard
        title="Stock Batches"
        description="All drug batches with expiry tracking and stock levels"
      >
        <StockBatchToolbar
          search={search}
          onSearch={handleSearchChange}
          activeFilter={activeFilter}
          onFilter={handleFilterChange}
        />
        <StockBatchTable
          batches={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onAdjust={setSelectedBatch}
        />
      </TableCard>

      {selectedBatch && (
        <StockAdjustmentModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onSubmit={handleAdjustment}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default StockBatchesPage;
