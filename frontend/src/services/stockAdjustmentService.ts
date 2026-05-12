import axiosClient from "@/api/axiosClient";
import type { StockAdjustment, StockAdjustmentPayload } from "@/types/stockBatch";

export const stockAdjustmentService = {
  create: async (payload: StockAdjustmentPayload): Promise<StockAdjustment> => {
    const { data } = await axiosClient.post<StockAdjustment>("/stockadjustments", payload);
    return data;
  },
};