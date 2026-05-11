export type OrderStatus = "Pending" | "Completed" | "PartiallyReceived" | "Cancelled";

export interface PurchaseOrderItem {
  purchaseOrderItemId: number;
  drugId: number;
  drugName: string;
  quantity: number;
  receivedQty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  purchaseOrderId: number;
  status: OrderStatus;
  orderDate: string;
  userId: number;
  userName: string;
  supplierId: number;
  supplierName: string;
  items: PurchaseOrderItem[];
}

export interface CreateOrderItem {
  drugId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  supplierId: number;
  items: CreateOrderItem[];
}

export interface StatusUpdateItem {
  purchaseOrderItemId: number;
  batchNumber: string;
  quantity: number;
  receivedQty: number;
  expiryDate: string;
  productionDate: string;
}

export interface StatusUpdatePayload {
  newStatus: OrderStatus;
  itemsData: StatusUpdateItem[];
}

export type OrderFilter = "all" | "Pending" | "Completed" | "PartiallyReceived" | "Cancelled";