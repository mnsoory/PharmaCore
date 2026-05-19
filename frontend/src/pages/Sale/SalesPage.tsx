import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import TableCard from "@/components/ui/table/TableCard";
import SalesOverviewTab from "./components/SalesOverviewTab";
import SalesTable from "./components/SalesTable";
import SaleDetailsModal from "./components/SaleDetailsModal";
import NewSaleModal from "./components/NewSaleModal";
import axios from "axios";
import { saleService } from "@/services/saleService";
import type { Sale, SalesTab, CreateSalePayload } from "@/types/sale";
import { saleKeys } from "@/api/keys";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { checkLowStock } from "@/hooks/useNotificationChecker";
import { useNotificationStore } from "@/store/useNotificationStore";

const tabs: { id: SalesTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "all-sales", label: "All Sales" },
  { id: "my-sales", label: "My Sales" },
];

const todayStr = new Date().toISOString().split("T")[0];
const monthAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState<SalesTab>("overview");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Sale | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [viewSale, setViewSale] = useState<Sale | null>(null);
  const [showNewSale, setShowNewSale] = useState(false);
  const [from, setFrom] = useState(monthAgoStr);
  const [to, setTo] = useState(todayStr);

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { addNotifications } = useNotificationStore();

  const {
    data: sales,
    isLoading: salesLoading,
    isFetching,
    isError: salesError,
    refetch,
  } = useQuery({
    queryKey: saleKeys.lists(),
    queryFn: saleService.getAll,
  });

  const { data: mySales } = useQuery({
    queryKey: saleKeys.mySales(),
    queryFn: saleService.getAllByCurrentUser,
    enabled: activeTab === "my-sales",
  });

  const { data: reportSales = [] } = useQuery({
    queryKey: saleKeys.report(from, to),
    queryFn: () => saleService.getReport(from, to),
    enabled: activeTab === "overview" && !!from && !!to,
  });

  const { data: salesSummary } = useQuery({
    queryKey: saleKeys.summary(from, to),
    queryFn: () => saleService.getSummary(from, to),
    enabled: !!from && !!to,
  });

  const isLoading = salesLoading;
  const isError = salesError;

  const handleSort = (field: keyof Sale) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleNewSale = async (payload: CreateSalePayload) => {
    setIsCreating(true);

    try {
      const newSale = await saleService.create(payload);
      toast.success(`Sale #${newSale.saleId} created successfully`);
      setShowNewSale(false);
      checkLowStock(addNotifications);
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
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

  const summary = useMemo(() => {
    if (!salesSummary) {
      return {
        totalRevenue: 0,
        salesCount: 0,
      };
    }
    return {
      totalRevenue: salesSummary?.totalRevenue,
      salesCount: salesSummary?.salesCount,
    };
  }, [salesSummary]);

  const filtered = useMemo(() => {
    const source = activeTab === "my-sales" ? (mySales ?? []) : (sales ?? []);

    let result = source;
    if (search) {
      result = result.filter(
        (s) =>
          String(s.saleId).includes(search) ||
          s.username.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField],
          bv = b[sortField];
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      });
    }
    return result;
  }, [sales, mySales, activeTab, search, sortField, sortDir]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !sales)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Sales</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage transactions and view reports
          </p>
        </div>
        <button
          onClick={() => setShowNewSale(true)}
          className="flex h-9 items-center gap-2 rounded-lg bg-sidebar-primary px-4 text-sm font-semibold text-sidebar-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Sale
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearch("");
            }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? "border-sidebar-primary text-sidebar-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <SalesOverviewTab
          summary={summary}
          reportSales={reportSales}
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
        />
      ) : (
        <TableCard
          title={activeTab === "all-sales" ? "All Sales" : "My Sales"}
          description={
            activeTab === "all-sales"
              ? "All transactions across all users"
              : "Your personal sales transactions"
          }
        >
          <div className="flex justify-end mb-5">
            <input
              className="h-9 w-52 rounded-lg border border-border bg-muted/40 px-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
              placeholder="Search sales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SalesTable
            sales={filtered}
            showUser={activeTab === "all-sales"}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            onView={setViewSale}
          />
        </TableCard>
      )}

      {viewSale && (
        <SaleDetailsModal sale={viewSale} onClose={() => setViewSale(null)} />
      )}

      {showNewSale && (
        <NewSaleModal
          onClose={() => setShowNewSale(false)}
          onSubmit={handleNewSale}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default SalesPage;
