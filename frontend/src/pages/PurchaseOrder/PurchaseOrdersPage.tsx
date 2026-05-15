import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import PurchaseOrderStatCards from "./components/PurchaseOrderStatCards";
import PurchaseOrderToolbar from "./components/PurchaseOrderToolbar";
import PurchaseOrderTable from "./components/PurchaseOrderTable";
import OrderDetailsModal from "./components/OrderDetailsModal";
import UpdateStatusModal from "./components/UpdateStatusModal";
import CreateOrderModal from "./components/CreateOrderModal";
import { purchaseOrderService } from "@/services/purchaseOrderService";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { purchaseOrderKeys } from "@/api/keys";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { toast } from "sonner";
import type {
  PurchaseOrder,
  OrderFilter,
  CreateOrderPayload,
  StatusUpdatePayload,
} from "@/types/purchaseOrder";

const PurchaseOrdersPage = () => {
  const {
    data: purchaseOrders,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: purchaseOrderKeys.lists(),
    queryFn: purchaseOrderService.getAll,
  });

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [sortField, setSortField] = useState<keyof PurchaseOrder | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);
  const [updateOrder, setUpdateOrder] = useState<PurchaseOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleCreate = async (payload: CreateOrderPayload) => {
    setIsCreating(true);
    try {
      const newOrder = await purchaseOrderService.create(payload);
      toast.success(
        `Purchase order #${newOrder.purchaseOrderId} created successfully`,
      );
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
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

  const handleStatusUpdate = async (
    id: number,
    payload: StatusUpdatePayload,
  ) => {
    setIsUpdating(true);
    try {
      await purchaseOrderService.updateStatus(id, payload);
      toast.success(`Order #${id} status updated to ${payload.newStatus}`);
      setUpdateOrder(null);
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.Message || err.response?.data?.message;
        toast.error(serverMessage ?? "Failed to update order status");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = useMemo(() => {
    if (!purchaseOrders) return [];
    let result = purchaseOrders.filter((o) => {
      const matchSearch =
        o.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        String(o.purchaseOrderId).includes(search) ||
        o.userName.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        activeFilter === "all" ? true : o.status === activeFilter;

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
  }, [purchaseOrders, search, activeFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    if (!purchaseOrders) {
      return {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      };
    }
    return {
      total: purchaseOrders.length,
      pending: purchaseOrders.filter((p) => p.status === "Pending").length,
      completed: purchaseOrders.filter((p) => p.status === "Completed").length,
      cancelled: purchaseOrders.filter((p) => p.status === "Cancelled").length,
    };
  }, [purchaseOrders]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !purchaseOrders)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      <PurchaseOrderStatCards {...stats} />

      <TableCard
        title="Purchase Orders"
        description="All supplier purchase orders and their current status"
      >
        <PurchaseOrderToolbar
          search={search}
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          onNew={() => setShowCreateModal(true)}
        />
        <PurchaseOrderTable
          orders={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onView={setViewOrder}
          onUpdateStatus={setUpdateOrder}
        />
      </TableCard>

      {viewOrder && (
        <OrderDetailsModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}

      {updateOrder && (
        <UpdateStatusModal
          order={updateOrder}
          onClose={() => setUpdateOrder(null)}
          onSubmit={handleStatusUpdate}
          isSubmitting={isUpdating}
        />
      )}

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
