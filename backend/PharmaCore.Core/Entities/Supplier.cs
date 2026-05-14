

namespace PharmaCore.Core.Entities
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new HashSet<PurchaseOrder>();
        public virtual ICollection<StockBatch> StockBatches { get; set; } = new HashSet<StockBatch>();
    }
}
