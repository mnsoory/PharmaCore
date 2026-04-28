

namespace PharmaCore.Core.DTOs.Drug
{
    public class TopSellingDrugDto
    {
        public string TradeName { get; set; } = string.Empty;
        public string Concentration { get; set; } = string.Empty;
        public int TotalSoldQuantity { get; set; } 
        public int CurrentStockQuantity { get; set; }
    }
}
