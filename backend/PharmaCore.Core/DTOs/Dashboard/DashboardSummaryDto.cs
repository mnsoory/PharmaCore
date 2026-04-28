

using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.DTOs.StockBatch;

namespace PharmaCore.Core.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal TodaySalesAmount { get; set; }
        public int TodaySalesCount { get; set; }
        public int LowStockCount { get; set; }
        public int ExpiringSoonCount { get; set; }
        public int ExpiredCount { get; set; }

        public List<LowStockDrugDto> LowStockDrugs { get; set; } = new();
        public List<StockBatchResponseDto> ExpiringSoonBatches { get; set; } = new();
        public List<StockBatchResponseDto> ExpiredBatches { get; set; } = new();
        public List<DailySalesDto> WeeklySales { get; set; } = new();
        public TopSellingDrugsResponse TopSellingDrugsResponse { get; set; } = null!;

        public int ActiveSuppliersCount { get; set; }
    }
}
