import axiosClient from "@/api/axiosClient";
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from "@/types/supplier";

export const supplierService = {

  getAll: async (): Promise<Supplier[]> => {
    const { data } = await axiosClient.get<Supplier[]>("/suppliers");
    return data;
  },

  getInactive: async (): Promise<Supplier[]> => {
    const { data } = await axiosClient.get<Supplier[]>("/suppliers/inactive");
    return data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const { data } = await axiosClient.get<Supplier>(`/suppliers/${id}`);
    return data;
  },

  create: async (payload: CreateSupplierPayload): Promise<Supplier> => {
    const { data } = await axiosClient.post<Supplier>("/suppliers", payload);
    return data;
  },

  update: async (id: number, payload: UpdateSupplierPayload): Promise<void> => {
    await axiosClient.put(`/suppliers/${id}`, payload);
  },

  toggleStatus: async (id: number): Promise<boolean> => {
    const { data } = await axiosClient.patch<boolean>(`/suppliers/${id}/status`);
    return data;
  },

};