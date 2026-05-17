import axiosClient from "@/api/axiosClient";
import type { CreateCancellationPayload, SaleCancellation } from "@/types/return";


export const saleCancellationService = {
    getAll: async (): Promise<SaleCancellation[]> => {
    const { data } = await axiosClient.get<SaleCancellation[]>("/salecancellations");
    return data;
  },

  getById: async (id: number): Promise<SaleCancellation> => {
    const { data } = await axiosClient.get<SaleCancellation>(`/salecancellations/${id}`);
    return data;
  },

  create: async (payload: CreateCancellationPayload): Promise<SaleCancellation> => {
    const { data } = await axiosClient.post<SaleCancellation>("/salecancellations", payload);
    return data;
  },
}