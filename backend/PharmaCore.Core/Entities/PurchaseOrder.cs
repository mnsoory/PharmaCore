using PharmaCore.Core.Enums;


namespace PharmaCore.Core.Entities
{
    public class PurchaseOrder
    {
        public int PurchaseOrderId { get; set; }
        public PurchaseOrderStatus Status { get; set; }

        public int UserId { get; set; }
        public int SupplierId { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Supplier Supplier { get; set; } = null!;

        public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new HashSet<PurchaseOrderItem>();
    }
}
