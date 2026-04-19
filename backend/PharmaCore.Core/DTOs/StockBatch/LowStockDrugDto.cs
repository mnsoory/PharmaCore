

namespace PharmaCore.Core.DTOs.StockBatch
{
    public class LowStockDrugDto
    {
        public int DrugId { get; set; }

        public string TradeName { get; set; } = string.Empty;

        public string GenericName { get; set; } = string.Empty;

        public string? Concentration { get; set; }

        public int CurrentStock { get; set; }

        public int MinimumStockThreshold { get; set; }
    }
}
