import axiosClient from "@/api/axiosClient";
import type { StockSetting } from "@/types/settings";

export const stockSettingsService = {
  getAll: async (): Promise<StockSetting[]> => {
    const { data } = await axiosClient.get<StockSetting[]>("/stocksettings");
    return data;
  },

  createOrUpdate: async (payload: { drugId: number; minimumStock: number }): Promise<void> => {
    await axiosClient.post("/stocksettings", payload);
  },

  delete: async (drugId: number): Promise<void> => {
    await axiosClient.delete(`/stocksettings/${drugId}`);
  },
};