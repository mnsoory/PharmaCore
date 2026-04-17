

namespace PharmaCore.Core.Entities
{
    public class SaleItem
    {
        public int SaleItemId { get; set; }
        public int SaleId { get; set; }
        public int DrugId { get; set; }
        public int BatchId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public Drug Drug { get; set; } = null!;
        public StockBatch Batch { get; set; } = null!;
        public Sale Sale { get; set; } = null!;
    }
}
