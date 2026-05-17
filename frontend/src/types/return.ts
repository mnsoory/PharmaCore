import type { Sale } from "@/types/sale";

export interface SaleCancellation {
  saleCancellationId: number;
  saleId: number;
  reason: string;
  cancelledBy: string;
  cancelledAt: string;
  sale: Sale;
}

export interface CreateCancellationPayload {
  saleId: number;
  reason: string;
}