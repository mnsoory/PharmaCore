import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import SupplierStatCards from "./components/SupplierStatCards";
import SupplierToolbar from "./components/SupplierToolbar";
import SupplierTable from "./components/SupplierTable";
import SupplierFormModal from "./components/SupplierFormModal";
import type {
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
  SupplierFilter,
} from "../../types/supplier";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierKeys } from "@/api/keys";
import { supplierService } from "@/services/supplierService";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

const SupplierPage = () => {
  const {
    data: suppliers,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: supplierService.getAll,
  });

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<SupplierFilter>("all");
  const [sortField, setSortField] = useState<keyof Supplier | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [editSupplier, setEditSupplier] = useState<Supplier | undefined>(
    undefined,
  );
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleSort = (field: keyof Supplier) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleCreate = async (payload: CreateSupplierPayload) => {
    setIsCreating(true);
    try {
      const createPayload = {
        ...payload,
        email: payload.email?.trim() === "" ? null : payload.email,
      };
      const supplier = await supplierService.create(createPayload);
      toast.success(`Supplier #${supplier.supplierId} created successfully`);
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number, payload: UpdateSupplierPayload) => {
    setIsUpdating(true);
    try {
      const updatePayload = {
        ...payload,
        email: payload.email?.trim() === "" ? null : payload.email,
      };
      await supplierService.update(id, updatePayload);
      toast.success(`Supplier #${id} updated successfully`);
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (supplier: Supplier) => {
    setIsToggling(true);
    try {
      await supplierService.toggleStatus(supplier.supplierId);
      toast.success(`Supplier #${supplier.supplierId} ${supplier.isActive ? "deactivated" : "activated"} successfully`);
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsToggling(false);
    }
  };

  const openEdit = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditSupplier(undefined);
    setShowModal(true);
  };

  const filtered = useMemo(() => {
    if (!suppliers) return [];
    let result = suppliers.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search);

      const matchFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
            ? s.isActive
            : !s.isActive;

      return matchSearch && matchFilter;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField] ?? "";
        const bv = b[sortField] ?? "";
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      });
    }

    return result;
  }, [suppliers, search, activeFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    if (!suppliers) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
      };
    }
    return {
      total: suppliers.length,
      active: suppliers.filter((s) => s.isActive).length,
      inactive: suppliers.filter((s) => !s.isActive).length,
    };
  }, [suppliers]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !suppliers)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your pharmacy suppliers
          </p>
        </div>
      </div>

      <SupplierStatCards {...stats} />

      <TableCard
        title="Suppliers"
        description="All registered suppliers and their status"
      >
        <SupplierToolbar
          search={search}
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          onAdd={openCreate}
        />
        <SupplierTable
          suppliers={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={openEdit}
          onToggleStatus={handleToggleStatus}
          isToggling={isToggling}
        />
      </TableCard>

      {showModal && (
        <SupplierFormModal
          supplier={editSupplier}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default SupplierPage;
