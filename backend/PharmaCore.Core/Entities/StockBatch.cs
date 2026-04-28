

namespace PharmaCore.Core.Entities
{
    public class StockBatch
    {
        public int StockBatchId { get; set; }
        public int SupplierId { get; set; }
        public int PurchaseOrderItemId { get; set; }
        public int DrugId { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public DateTime ProductionDate { get; set; }
        public int Quantity { get; set; }
        public int RemainingQty { get; set; }
        public decimal PurchasePrice { get; set; }

        public virtual Supplier Supplier { get; set; } = null!;
        public virtual PurchaseOrderItem PurchaseOrderItem { get; set; } = null!;
        public virtual Drug Drug { get; set; } = null!;
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new HashSet<SaleItem>();
    }
}
