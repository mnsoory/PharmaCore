export interface Supplier {
  supplierId: number;
  name: string;
  phone: string;
  company: string;
  isActive: boolean;
}

export interface CreateSupplierPayload {
  name: string;
  phone: string;
  company: string;
}

export interface UpdateSupplierPayload {
  name: string;
  phone: string;
  company: string;
  isActive: boolean;
}

export type SupplierFilter = "all" | "active" | "inactive";