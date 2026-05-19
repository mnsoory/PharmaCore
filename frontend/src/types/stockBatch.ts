export interface StockBatch {
  stockBatchId: number;
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
  concentration: string;
  supplierName: string;
  minimumStockThreshold: number;
  isExpired: boolean;
  status: BatchStatus;
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

export type StockAdjustmentType = 
  | "addition" 
  | "deduction" 
  | "damage" 
  | "expired" 
  | "correction" 
  | "returnFromCustomer" 
  | "returnToSupplier";

  export type StockAdjustmentTypeBackend = 
  | "Addition" 
  | "Deduction" 
  | "Damage" 
  | "Expired" 
  | "Correction" 
  | "ReturnFromCustomer" 
  | "ReturnToSupplier";

export type BatchFilter = "all" | "safe" | "expiring-soon" | "expired";

export interface StockAdjustment {
  stockAdjustmentId: number;
  drugId: number;
  drugName: string;
  batchNumber: string;
  username: string;
  quantity: number;
  reason: string;
  adjustmentType: StockAdjustmentType;
  adjustmentDate: string;
}

export interface StockAdjustmentPayload {
  stockBatchId: number;
  quantity: number;
  reason: string;
  adjustmentType: StockAdjustmentTypeBackend;
}

export type BatchStatus = "Safe" | "Expired" | "Expiring Soon";

export const toBackendAdjustmentType = (
  type: StockAdjustmentType
): StockAdjustmentTypeBackend => {
  switch (type) {
    case "addition":           return "Addition";
    case "deduction":          return "Deduction";
    case "damage":             return "Damage";
    case "expired":            return "Expired";
    case "correction":         return "Correction";
    case "returnFromCustomer": return "ReturnFromCustomer";
    case "returnToSupplier":   return "ReturnToSupplier";
    default:                   return "Addition";
  }
};