export const drugKeys = {
  all: ["drugs"] as const,
  lists: () => [...drugKeys.all, "list"] as const,
  details: (id: number) => [...drugKeys.all, "detail", id] as const,
  stock: (id: number) => [...drugKeys.all, "stock", id] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
};

export const purchaseOrderKeys = {
  all: ["purchaseOrders"] as const,
  lists: () => [...purchaseOrderKeys.all, "list"] as const,
  details: (id: number) => [...purchaseOrderKeys.all, "detail", id] as const,
};

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  inactive: () => [...supplierKeys.all, "inactive"] as const,
  detail: (id: number) => [...supplierKeys.all, "detail", id] as const,
};

export const stockBatchKeys = {
  all: ["stockBatches"] as const,
  lists: () => [...stockBatchKeys.all, "list"] as const,
};