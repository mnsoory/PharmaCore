

namespace PharmaCore.Core.DTOs.StockAdjustment
{
    public class StockAdjustmentResponseDto
    {
        public int StockAdjustmentId { get; set; }
        public int DrugId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public string BatchNumber { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string AdjustmentType { get; set; } = string.Empty;
        public DateTime AdjustmentDate { get; set; }
    }
}
