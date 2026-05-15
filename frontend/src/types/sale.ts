export interface SaleItem {
  saleItemId: number;
  drugName: string;
  concentration: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Sale {
  saleId: number;
  username: string;
  totalAmount: number;
  discount: number;
  paymentMethod: string;
  saleDate: string;
  saleItems: SaleItem[];
}

export interface SalesSummary {
  totalRevenue: number;
  salesCount: number;
}

export interface CreateSaleItem {
  batchId: number;
  quantity: number;
}

export interface CreateSalePayload {
  saleItems: CreateSaleItem[];
  discount: number;
  paymentMethod: string;
}

export type SalesTab = "overview" | "all-sales" | "my-sales";