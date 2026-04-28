export interface TopSellingDrug {
  tradeName: string;
  concentration: string;
  totalSoldQuantity: number;
  currentStockQuantity: number;
}

export interface TopSellingDrugsResponse {
  daysPeriod: number;
  startDate: string;
  drugs: TopSellingDrug[];
}

export interface LowStockDrug {
  drugId: number;
  tradeName: string;
  genericName: string;
  concentration: string;
  currentStock: number;
  minimumStockThreshold: number;
}

export interface DailySalesData {
  date: string;
  totalSales: number;
}

export interface DashboardData {
  todaySalesAmount: number;
  todaySalesCount: number;
  lowStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  totalRevenue: number;
  activeSuppliersCount: number;
  lowStockDrugs: LowStockDrug[];
  weeklySales: DailySalesData[];
  topSellingDrugsResponse: TopSellingDrugsResponse;
}
