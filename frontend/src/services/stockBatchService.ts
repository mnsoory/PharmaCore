import axiosClient from "@/api/axiosClient";
import { differenceInDays, isBefore, parseISO } from "date-fns";
import type {
  ExpiringSoonResponse,
  LowStockItem,
  StockBatch,
} from "@/types/stockBatch";

const transformBatch = (batch: StockBatch): StockBatch => {
  const today = new Date();
  const expiryDate = parseISO(batch.expiryDate);

  const daysUntilExpiry = differenceInDays(expiryDate, today);

  let status: StockBatch["status"] = "Available";

  if (batch.isExpired || isBefore(expiryDate, today)) {
    status = "Expired";
  } else if (daysUntilExpiry <= 90) {
    status = "Expiring Soon";
  } else if (
    batch.remainingQty < batch.minimumStockThreshold &&
    batch.remainingQty > 0
  ) {
    status = "Low";
  }

  return {
    ...batch,
    status,
  };
};

export const stockBatchService = {
getAll: async (searchTerm?: string): Promise<StockBatch[]> => {
  const { data } = await axiosClient.get<StockBatch[]>("/stockbatches", {
    params: {
      search: searchTerm?.trim() || undefined,
    },
  });
  return data.map(transformBatch);
},

  getById: async (id: number): Promise<StockBatch> => {
    const { data } = await axiosClient.get<StockBatch>(`/stockbatches/${id}`);
    return transformBatch(data);
  },

  getByDrugId: async (drugId: number): Promise<StockBatch[]> => {
    const { data } = await axiosClient.get<StockBatch[]>(
      `/stockbatches/drug/${drugId}`,
    );
    return data.map(transformBatch);
  },

  getAvailableForSaleByDrugId: async (
    drugId: number,
  ): Promise<StockBatch[]> => {
    const { data } = await axiosClient.get<StockBatch[]>(
      `/stockbatches/drug/${drugId}/available`,
    );
    return data.map(transformBatch);
  },

  getExpired: async (): Promise<StockBatch[]> => {
    const { data } = await axiosClient.get<StockBatch[]>(
      "/stockbatches/expired",
    );
    return data;
  },

  getExpiringSoon: async (): Promise<ExpiringSoonResponse> => {
    const { data } = await axiosClient.get<ExpiringSoonResponse>(
      "/stockbatches/expiring-soon",
    );
    return data;
  },

  getLowStock: async (): Promise<LowStockItem[]> => {
    const { data } = await axiosClient.get<LowStockItem[]>(
      "/stockbatches/low-stock",
    );
    return data;
  },
};
