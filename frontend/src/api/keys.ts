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
  detail: (id: number) => [...stockBatchKeys.all, "detail", id] as const,
  search: (term: string) =>
    [
      ...stockBatchKeys.all,
      "search",
      term?.toLowerCase().trim() ?? "",
    ] as const,
};

export const saleKeys = {
  all: ["sales"] as const,
  lists: () => [...saleKeys.all, "list"] as const,
  mySales: () => [...saleKeys.all, "my-sales"] as const,
  detail: (id: number) => [...saleKeys.all, "detail", id] as const,
  summary: (from?: string | null, to?: string | null) => 
    [...saleKeys.all, "summary", { from, to }] as const,
  report: (from?: string | null, to?: string | null) => 
    [...saleKeys.all, "report", { from, to }] as const,
};

export const returnKeys = {
  all: ["saleCancellations"] as const,
  lists: () => [...returnKeys.all, "list"] as const,
  details: (id: number) => [...returnKeys.all, "detail", id] as const,
};

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
  
};

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};