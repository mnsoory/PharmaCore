export interface Supplier {
  supplierId: number;
  name: string;
  phone: string;
  email?: string;
  contactPerson: string;
  isActive: boolean;
}

export interface CreateSupplierPayload {
  supplierName: string;
  phone: string;
  email?: string;
  contactPerson: string;
}

export interface UpdateSupplierPayload {
  supplierName: string;
  phone: string;
  email?: string;
  contactPerson: string;
  isActive: boolean;
}

export type SupplierFilter = "all" | "active" | "inactive";
