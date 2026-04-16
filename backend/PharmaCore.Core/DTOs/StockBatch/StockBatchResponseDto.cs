namespace PharmaCore.Core.DTOs.StockBatch
{
    public class StockBatchResponseDto
    {
        public int StockBatchId { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public DateTime ProductionDate { get; set; }
        public int Quantity { get; set; }
        public int RemainingQty { get; set; }
        public decimal PurchasePrice { get; set; }

        public int DrugId { get; set; }
        public int SupplierId { get; set; }
        public int PurchaseOrderItemId { get; set; }

        public string DrugName { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;

        public bool IsExpired => ExpiryDate <= DateTime.UtcNow;
    }
}