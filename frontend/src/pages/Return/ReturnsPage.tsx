import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import TableCard from "@/components/ui/table/TableCard";
import ReturnStatCards from "./components/ReturnStatCards";
import ReturnsTable from "./components/ReturnsTable";
import ReturnDetailsModal from "./components/ReturnDetailsModal";
import NewReturnModal from "./components/NewReturnModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { saleCancellationService } from "@/services/saleCancellationService";
import { toast } from "sonner";
import type {
  SaleCancellation,
  CreateCancellationPayload,
} from "@/types/return";
import { returnKeys } from "@/api/keys";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { handleApiError } from "@/utils/errorHandler";

const ReturnsPage = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof SaleCancellation | null>(
    null,
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [viewReturn, setViewReturn] = useState<SaleCancellation | null>(null);
  const [showNewReturn, setShowNewReturn] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const queryClient = useQueryClient();

  const handleSort = (field: keyof SaleCancellation) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const {
    data: saleCancellations,
    isLoading: saleCancellationsLoading,
    isFetching,
    isError: saleCancellationsError,
    refetch,
  } = useQuery({
    queryKey: returnKeys.lists(),
    queryFn: saleCancellationService.getAll,
  });

  const isLoading = saleCancellationsLoading;
  const isError = saleCancellationsError;

  const handleNewReturn = async (payload: CreateCancellationPayload) => {
    setIsCancelling(true);
    try {
      const newReturn = await saleCancellationService.create(payload);
      toast.success(
        `Sale #${newReturn.saleCancellationId} cancelled successfully`,
      );
      setShowNewReturn(false);
      queryClient.invalidateQueries({ queryKey: returnKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCancelling(false);
    }
  };

  const filtered = useMemo(() => {
    if (!saleCancellations) return [];
    let result = saleCancellations.filter(
      (c) =>
        String(c.saleId).includes(search) ||
        String(c.saleCancellationId).includes(search) ||
        c.cancelledBy.toLowerCase().includes(search.toLowerCase()) ||
        c.reason.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField],
          bv = b[sortField];
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      });
    }

    return result;
  }, [saleCancellations, search, sortField, sortDir]);

  const stats = useMemo(() => {
    if (!saleCancellations) {
      return {
        totalReturns: 0,
        totalRefunded: 0,
        thisMonth: 0,
      };
    }
    return {
      totalReturns: saleCancellations.length,
      totalRefunded: saleCancellations.reduce(
        (sum, c) => sum + c.sale.totalAmount,
        0,
      ),
      thisMonth: saleCancellations.filter((c) => {
        const month = new Date().getMonth();
        return new Date(c.cancelledAt).getMonth() === month;
      }).length,
    };
  }, [saleCancellations]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !saleCancellations)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Returns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage sale cancellations and refunds
          </p>
        </div>
        <button
          onClick={() => setShowNewReturn(true)}
          className="flex h-9 items-center gap-2 rounded-lg bg-destructive text-destructive-foreground px-4 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Return
        </button>
      </div>

      <ReturnStatCards {...stats} />

      <TableCard
        title="Returns & Cancellations"
        description="All cancelled sales and refunded transactions"
      >
        <div className="flex justify-end mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              className="h-9 w-56 rounded-lg border border-border bg-muted/40 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
              placeholder="Search returns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ReturnsTable
          cancellations={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onView={setViewReturn}
        />
      </TableCard>

      {viewReturn && (
        <ReturnDetailsModal
          cancellation={viewReturn}
          onClose={() => setViewReturn(null)}
        />
      )}
      {showNewReturn && (
        <NewReturnModal
          onClose={() => setShowNewReturn(false)}
          onSubmit={handleNewReturn}
          isCancelling={isCancelling}
        />
      )}
    </div>
  );
};

export default ReturnsPage;
