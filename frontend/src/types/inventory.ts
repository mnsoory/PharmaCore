export interface Drug {
  id: number;
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: string;
  concentration: string;
  category: string;
  totalAvailableStock: number;
  minimumStock: number;
  averagePurchasePrice: number;
  requiresPrescription: boolean;
  status: "Safe" | "Low Stock" | "Out of Stock";
}

export interface EditDrugFormData {
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: string;
  concentration: string;
  category: string;
  requiresPrescription: boolean;
}

// GET /api/drugs/{id}
export interface DrugDetailResponse {
  drugId: number;
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: string;
  concentration: string;
  category: string;
  requiresPrescription: boolean;
  minimumStock: number;
}

// GET /api/stockbatches/drug/{drugId}
export interface StockBatchResponse {
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
  drugName: string;
  supplierName: string;
  isExpired: boolean;
}

export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export interface DrugFormData {
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: string;
  concentration: string;
  category: string;
  requiresPrescription: boolean;
  minimumStock: number;
}