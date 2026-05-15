import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import StockBatchStatCards from "./components/StockBatchStatCards";
import StockBatchToolbar from "./components/StockBatchToolbar";
import StockBatchTable from "./components/StockBatchTable";
import StockAdjustmentModal from "./components/StockAdjustmentModal";
import { stockBatchKeys } from "@/api/keys";
import axios from "axios";
import { stockBatchService } from "@/services/stockBatchService";
import { stockAdjustmentService } from "@/services/stockAdjustmentService";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { toast } from "sonner";
import type {
  StockBatch,
  StockAdjustmentPayload,
  BatchFilter,
} from "@/types/stockBatch";

// const mockBatches: StockBatch[] = [
//   {
//     id: 1,
//     drugId: 1,
//     tradeName: "Panadol",
//     genericName: "Paracetamol",
//     batchNumber: "BTH-001",
//     quantity: 150,
//     expiryDate: "2026-12-01",
//     purchasePrice: 5.5,
//     status: "Available",
//     productionDate: "2024-01-01",
//     remainingQty: 150,
//     supplierId: 101,
//     purchaseOrderItemId: 501,
//     supplierName: "Global Pharma",
//   },
//   {
//     id: 2,
//     drugId: 2,
//     tradeName: "Amoxil",
//     genericName: "Amoxicillin",
//     batchNumber: "BTH-002",
//     quantity: 15,
//     expiryDate: "2025-06-15",
//     purchasePrice: 12.0,
//     status: "Low",
//     productionDate: "2024-03-15",
//     remainingQty: 15,
//     supplierId: 102,
//     purchaseOrderItemId: 502,
//     supplierName: "HealthCare Supplies",
//   },
//   {
//     id: 3,
//     drugId: 3,
//     tradeName: "Augmentin",
//     genericName: "Co-amoxiclav",
//     batchNumber: "BTH-003",
//     quantity: 0,
//     expiryDate: "2025-03-01",
//     purchasePrice: 25.0,
//     status: "Expired",
//     productionDate: "2023-03-01",
//     remainingQty: 0,
//     supplierId: 101,
//     purchaseOrderItemId: 503,
//     supplierName: "Global Pharma",
//   },
//   {
//     id: 4,
//     drugId: 1,
//     tradeName: "Panadol",
//     genericName: "Paracetamol",
//     batchNumber: "BTH-004",
//     quantity: 80,
//     expiryDate: "2025-07-20",
//     purchasePrice: 5.5,
//     status: "Expiring Soon",
//     productionDate: "2024-07-20",
//     remainingQty: 80,
//     supplierId: 103,
//     purchaseOrderItemId: 504,
//     supplierName: "Modern Med",
//   },
// ];

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

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<BatchFilter>("all");
  const [sortField, setSortField] = useState<keyof StockBatch | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const handleSort = (field: keyof StockBatch) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleAdjustment = async (adjustment: StockAdjustmentPayload) => {
    setIsCreating(true);
    console.log("adj:", adjustment)
    try {
      const newAdjustment = await stockAdjustmentService.create(adjustment);
      toast.success(
        `Adjustment completed successfully! (#${newAdjustment.stockAdjustmentId})`,
        {
          description: `${adjustment.adjustmentType} - ${adjustment.quantity} units`,
        },
      );
      setSelectedBatch(null);
      queryClient.invalidateQueries({ queryKey: stockBatchKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: stockBatchKeys.detail(adjustment.stockBatchId),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.Message || err.response?.data?.message;
        if (serverMessage) {
          toast.error(serverMessage);
        } else if (err.response?.status === 400) {
          toast.error("Invalid order data. Please check your inputs.");
        } else if (err.code === "ERR_NETWORK") {
          toast.error("Connection failed. Please check your network.");
        } else {
          toast.error(
            `Unexpected error (${err.response?.status ?? "Unknown"})`,
          );
        }
      }
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

      const matchFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "available"
            ? b.status === "Available"
            : activeFilter === "low-stock"
              ? b.status === "Low"
              : activeFilter === "expiring-soon"
                ? b.status === "Expiring Soon"
                : activeFilter === "expired"
                  ? b.status === "Expired"
                  : true;

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
    console.log("batches:", stockBatches)
    if (!stockBatches) {
      return {
        total: 0,
        expiringSoon: 0,
        expired: 0,
        lowStock: 0,
      };
    }

    return {
      total: stockBatches.length,
      expiringSoon: stockBatches.filter((b) => b.status === "Expiring Soon")
        .length,
      expired: stockBatches.filter((b) => b.status === "Expired").length,
      lowStock: stockBatches.filter((b) => b.status === "Low").length,
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
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
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
