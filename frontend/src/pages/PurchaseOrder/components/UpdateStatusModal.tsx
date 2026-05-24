import React, { useState } from "react";
import { X, Package, ChevronDown } from "lucide-react";
import type {
  PurchaseOrder,
  StatusUpdatePayload,
  StatusUpdateItem,
  OrderStatus,
} from "@/types/purchaseOrder";

interface Props {
  order: PurchaseOrder;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: StatusUpdatePayload) => void;
}

const nextStatuses: Record<string, OrderStatus[]> = {
  Pending: ["PartiallyReceived", "Completed", "Cancelled"],
  PartiallyReceived: ["PartiallyReceived", "Completed"],
};

const UpdateStatusModal: React.FC<Props> = ({
  order,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const options = nextStatuses[order.status] ?? [];
  const [newStatus, setNewStatus] = useState<OrderStatus>(options[0]);

  const [itemsData, setItemsData] = useState<StatusUpdateItem[]>(
    order.items.map((i) => ({
      purchaseOrderItemId: i.purchaseOrderItemId,
      batchNumber: "",
      quantity: i.quantity,
      receivedQty: i.receivedQty,
      expiryDate: "",
      productionDate: "",
    })),
  );

  const updateItem = (
    index: number,
    field: keyof StatusUpdateItem,
    value: string | number,
  ) => {
    setItemsData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(order.purchaseOrderId, {
      newStatus,
      itemsData:
        newStatus === "Completed" || newStatus === "PartiallyReceived"
          ? itemsData
          : [],
    });
  };

  const isReceiving =
    newStatus === "Completed" || newStatus === "PartiallyReceived";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-135 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Update Order Status
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Order #{order.purchaseOrderId} · {order.supplierName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* New status */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                New Status
              </label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                >
                  {options.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Batch data */}
            {isReceiving && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Batch Information
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    Fill in batch details for each received item
                  </span>
                </p>

                {order.items.map((item, index) => (
                  <div
                    key={item.purchaseOrderItemId}
                    className="rounded-lg border border-border bg-muted/20 p-4 space-y-3"
                  >
                    {/* Drug name */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {item.drugName}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            Ordered:{" "}
                            <span className="font-medium text-foreground">
                              {item.quantity}
                            </span>
                          </p>
                          {order.status === "PartiallyReceived" && (
                            <>
                              <span className="text-muted-foreground/40">
                                ·
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Received:{" "}
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  {item.receivedQty ?? 0}
                                </span>
                              </p>
                              <span className="text-muted-foreground/40">
                                ·
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Remaining:{" "}
                                <span className="font-medium text-orange-500">
                                  {item.quantity - (item.receivedQty ?? 0)}
                                </span>
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Batch number */}
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Batch Number
                        </label>
                        <input
                          required
                          placeholder="e.g. BTH-001"
                          value={itemsData[index].batchNumber}
                          onChange={(e) =>
                            updateItem(index, "batchNumber", e.target.value)
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Received Qty
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={itemsData[index].receivedQty}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "receivedQty",
                              Number(e.target.value),
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                        />
                      </div>

                      {/* Production date */}
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Production Date
                        </label>
                        <input
                          type="date"
                          required
                          value={itemsData[index].productionDate}
                          onChange={(e) =>
                            updateItem(index, "productionDate", e.target.value)
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                        />
                      </div>

                      {/* Expiry date */}
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          required
                          value={itemsData[index].expiryDate}
                          onChange={(e) =>
                            updateItem(index, "expiryDate", e.target.value)
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-5 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Updating...
                </span>
              ) : (
                "Confirm Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
