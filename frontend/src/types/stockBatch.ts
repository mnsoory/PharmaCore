export interface StockBatch {
  id: number;
  batchNumber: string;
  expiryDate: string;
  productionDate: string;
  quantity: number;
  remainingQty: number;
  purchasePrice: number;
  drugId: number;
  supplierId: number;
  purchaseOrderItemId: number;
  tradeName: string;
  genericName: string;
  supplierName: string;
  minimumStockThreshold: number;
  isExpired: boolean;
  status: "Available" | "Low" | "Expired" | "Expiring Soon";
}

export interface ExpiringSoonResponse {
  within30Days: StockBatch[];
  within60Days: StockBatch[];
  within90Days: StockBatch[];
}

export interface LowStockItem {
  drugId: number;
  tradeName: string;
  genericName: string;
  concentration: string;
  currentStock: number;
  minimumStockThreshold: number;
}

export type BatchFilter = "all" | "available" | "low-stock" | "expiring-soon" | "expired";

export interface StockAdjustmentPayload {
  drugId: number;
  quantity: number;
  reason: string;
  type: "Add" | "Remove";
}

export type BatchStatus = "Available" | "Low" | "Expired" | "Expiring Soon";