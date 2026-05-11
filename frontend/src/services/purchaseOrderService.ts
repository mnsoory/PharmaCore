import axiosClient from "@/api/axiosClient";
import type {
  PurchaseOrder,
  CreateOrderPayload,
  StatusUpdatePayload,
} from "@/types/purchaseOrder";

export const purchaseOrderService = {

  getAll: async (): Promise<PurchaseOrder[]> => {
    const { data } = await axiosClient.get<PurchaseOrder[]>("/purchaseorders");
    return data;
  },

  getById: async (id: number): Promise<PurchaseOrder> => {
    const { data } = await axiosClient.get<PurchaseOrder>(`/purchaseorders/${id}`);
    return data;
  },

  create: async (payload: CreateOrderPayload): Promise<PurchaseOrder> => {
    const { data } = await axiosClient.post<PurchaseOrder>("/purchaseorders", payload);
    return data;
  },

  updateStatus: async (id: number, payload: StatusUpdatePayload): Promise<void> => {
    await axiosClient.patch(`/purchaseorders/${id}/status`, payload);
  },

};