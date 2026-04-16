

using PharmaCore.Core.Enums;

namespace PharmaCore.Core.Entities
{
    public class StockAdjustment
    {
        public int StockAdjustmentId { get; set; }
        public int StockBatchId { get; set; }
        public int UserId { get; set; }

        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public StockAdjustmentType AdjustmentType { get; set; }
        public DateTime AdjustmentDate { get; set; } = DateTime.UtcNow;

        public virtual StockBatch StockBatch { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
