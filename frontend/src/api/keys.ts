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