import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import InventoryStatCards from "./components/InventoryStatCards";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryTable from "./components/InventoryTable";
import type { Drug } from "../../types/inventory";
import AddDrugModal from "./components/AddDrugModal";
import type { DrugFormData, EditDrugFormData } from "@/types/inventory";
import { inventoryService } from "@/services/inventoryService";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { drugKeys } from "@/api/keys";
import axios from "axios";
import { toast } from "sonner";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import EditDrugModal from "./components/EditDrugModal";
import DrugDetailsModal from "./components/DrugDetailsModal";

// const initialDrugs: Drug[] = [
//   {
//     id: 1,
//     tradeName: "Panadol",
//     genericName: "Paracetamol",
//     concentration: "500mg",
//     category: "Analgesics",
//     totalAvailableStock: 150,
//     minimumStock: 50,
//     averagePurchasePrice: 5.5,
//     status: "Safe",
//   },
// ];

const InventoryPage = () => {
  const {
    data: drugs,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: drugKeys.lists(),
    queryFn: inventoryService.getAllDrugs,
  });

  // const [drugs] = useState<Drug[]>(initialDrugs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Drug | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const [editDrug, setEditDrug] = useState<Drug | null>(null);
  const [detailDrug, setDetailDrug] = useState<Drug | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingsOnlyUpdate, setIsSettingsOnlyUpdate] = useState(false);

  const handleEditDrug = async (id: number, data: EditDrugFormData) => {
    setIsEditing(true);
    try {
      if (isSettingsOnlyUpdate)
        await inventoryService.updateStockSettings({
          drugId: id,
          minimumStock: data.minimumStock,
        });
      else await inventoryService.updateDrug(id, data);
      toast.success("Drug updated successfully");
      setEditDrug(null);
      setIsSettingsOnlyUpdate(false);
      queryClient.invalidateQueries({ queryKey: drugKeys.lists() });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.Message ?? "Failed to update drug");
      }
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteDrug = async (id: number) => {
    setIsDeleting(true);
    try {
      await inventoryService.deleteDrug(id);
      toast.success("Drug deleted successfully");
      setDetailDrug(null);
      queryClient.invalidateQueries({ queryKey: drugKeys.lists() });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.Message ?? "Failed to delete drug");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddDrug = async (drugData: DrugFormData) => {
    setIsSaving(true);
    console.log("drug", drugData);
    try {
      const newDrug = await inventoryService.createDrug(drugData);

      if (newDrug) {
        toast.success(`${newDrug.tradeName} added successfully`);
        setIsAddModalOpen(false);
        queryClient.invalidateQueries({ queryKey: drugKeys.lists() });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.Message || err.response?.data?.message;

        if (serverMessage) {
          toast.error(serverMessage);
        } else if (err.code === "ERR_NETWORK") {
          toast.error(
            "Unable to connect to server. Please check your connection.",
          );
        } else {
          toast.error(
            `Unexpected error (${err.response?.status || "Unknown"})`,
          );
        }
      } else {
        toast.error("A client-side error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSort = (field: keyof Drug) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    if (!drugs) return [];
    let result = drugs.filter(
      (d) =>
        (d.tradeName.toLowerCase().includes(search.toLowerCase()) ||
          d.genericName.toLowerCase().includes(search.toLowerCase()) ||
          d.concentration.toLowerCase().includes(search.toLowerCase())) &&
        (categoryFilter ? d.category === categoryFilter : true) &&
        (statusFilter ? d.status === statusFilter : true),
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
  }, [drugs, search, categoryFilter, statusFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    if (!drugs) {
      return {
        totalDrugs: 0,
        lowStock: 0,
        outOfStock: 0,
        expiringSoon: 0,
      };
    }
    return {
      totalDrugs: drugs.length,
      lowStock: drugs.filter((d) => d.status === "Low Stock").length,
      outOfStock: drugs.filter((d) => d.status === "Out of Stock").length,
      expiringSoon: 0, // to-do later
    };
  }, [drugs]);

  const categories = useMemo(() => {
    if (!drugs) return [];
    return [...new Set(drugs.map((d) => d.category))];
  }, [drugs]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !drugs)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      <InventoryStatCards {...stats} />
      <TableCard
        title="Inventory"
        description="All registered drugs and their current stock levels"
      >
        <InventoryToolbar
          search={search}
          onSearch={setSearch}
          categoryFilter={categoryFilter}
          onCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          categories={categories}
          onAdd={() => setIsAddModalOpen(true)}
        />
        <InventoryTable
          drugs={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={(drug) => setEditDrug(drug)}
          onViewDetails={(drug) => setDetailDrug(drug)}
        />
      </TableCard>
      {isAddModalOpen && (
        <AddDrugModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddDrug}
          isSubmitting={isSaving}
        />
      )}

      {editDrug && (
        <EditDrugModal
          drug={editDrug}
          onClose={() => setEditDrug(null)}
          onSubmit={handleEditDrug}
          isSubmitting={isEditing}
          isSettingsOnly={isSettingsOnlyUpdate}
          onToggleSettingsOnly={setIsSettingsOnlyUpdate}
        />
      )}

      {detailDrug && (
        <DrugDetailsModal
          drug={detailDrug}
          onClose={() => setDetailDrug(null)}
          onEdit={(drug) => {
            setDetailDrug(null);
            setEditDrug(drug);
          }}
          onDelete={handleDeleteDrug}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default InventoryPage;
