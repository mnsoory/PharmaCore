import axiosClient from "@/api/axiosClient";
import type { CreateSalePayload, Sale, SalesSummary } from "@/types/sale";

export const saleService = {

  getAll: async (): Promise<Sale[]> => {
    const { data } = await axiosClient.get<Sale[]>("/sales/all");
    return data;
  },

  getAllByUserId: async (userId: number): Promise<Sale[]> => {
    const { data } = await axiosClient.get<Sale[]>(`/sales/user/${userId}`);
    return data;
  },

  getAllByCurrentUser: async (): Promise<Sale[]> => {
    const { data } = await axiosClient.get<Sale[]>("/sales/my-sales");
    return data;
  },

  getReport: async (from?: string, to?: string): Promise<Sale[]> => {
  const { data } = await axiosClient.get<Sale[]>("/sales/report", {
    params: {
      from: from?.trim(),
      to:   to?.trim(),
    },
  });
  return data;
},

getSummary: async (from?: string, to?: string): Promise<SalesSummary> => {
  const { data } = await axiosClient.get<SalesSummary>("/sales/summary", {
    params: {
      from: from,
      to:   to,
    },
  });
  return data;
},

  getById: async (id: number): Promise<Sale> => {
    const { data } = await axiosClient.get<Sale>(`/sales/${id}`);
    return data;
  },

  create: async (payload: CreateSalePayload): Promise<Sale> => {
    const { data } = await axiosClient.post<Sale>("/sales", payload);
    return data;
  },
};