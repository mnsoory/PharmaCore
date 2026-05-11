import axiosClient from "@/api/axiosClient";
import type {
  DrugFormData,
  DrugDetailResponse,
  StockBatchResponse,
  Drug,
  EditDrugFormData,
  StockSettingsPayload,
} from "@/types/inventory";

const mapDrugData = (
  drugData: DrugDetailResponse,
  batches: StockBatchResponse[],
): Drug => {
  const totalAvailable = batches.reduce(
    (acc, batch) => acc + batch.remainingQty,
    0,
  );
  const avgPurchasePrice =
    batches.length > 0
      ? batches.reduce((acc, b) => acc + b.purchasePrice, 0) / batches.length
      : 0;

  const minStockThreshold = drugData.minimumStock;

  let currentStatus: "Safe" | "Low Stock" | "Out of Stock" = "Safe";
  if (totalAvailable <= 0) {
    currentStatus = "Out of Stock";
  } else if (totalAvailable <= minStockThreshold) {
    currentStatus = "Low Stock";
  }

  return {
    id: drugData.drugId,
    tradeName: drugData.tradeName,
    genericName: drugData.genericName,
    manufacturer: drugData.manufacturer,
    form: drugData.form,
    concentration: drugData.concentration,
    category: drugData.category,
    requiresPrescription: drugData.requiresPrescription,
    totalAvailableStock: totalAvailable,
    minimumStock: minStockThreshold,
    averagePurchasePrice: avgPurchasePrice,
    status: currentStatus,
  };
};

export const inventoryService = {
  createDrug: async (drugData: DrugFormData): Promise<Drug> => {
    const response = await axiosClient.post<Drug>("/drugs", drugData);
    return response.data;
  },

  updateDrug: async (id: number, drugData: EditDrugFormData): Promise<void> => {
    const stockPayload: StockSettingsPayload = {
      drugId: id,
      minimumStock: drugData.minimumStock,
    };

    await Promise.all([
      axiosClient.put(`/drugs/${id}`, drugData),
      axiosClient.post("/stocksettings", stockPayload),
    ]);
  },

  updateStockSettings: async (payload: StockSettingsPayload): Promise<void> => {
    await axiosClient.post("/stocksettings", payload);
  },

  getDrugById: async (id: number): Promise<Drug> => {
    const [drugRes, batchesRes] = await Promise.all([
      axiosClient.get<DrugDetailResponse>(`/drugs/${id}`),
      axiosClient.get<StockBatchResponse[]>(`/stockbatches/drug/${id}`),
    ]);

    return mapDrugData(drugRes.data, batchesRes.data);
  },

  getAllDrugs: async (): Promise<Drug[]> => {
    const response = await axiosClient.get<DrugDetailResponse[]>("/drugs");
    const drugsBaseData = response.data;

    const allBatchesRes =
      await axiosClient.get<StockBatchResponse[]>("/stockbatches");
    const allBatches = allBatchesRes.data;

    return drugsBaseData.map((drug) => {
      const drugBatches = allBatches.filter((b) => b.drugId === drug.drugId);
      return mapDrugData(drug, drugBatches);
    });
  },

  deleteDrug: async (id: number): Promise<void> => {
    await axiosClient.delete(`/drugs/${id}`);
  },
};
