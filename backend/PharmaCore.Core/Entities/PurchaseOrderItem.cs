

namespace PharmaCore.Core.Entities
{
    public class PurchaseOrderItem
    {
        public int PurchaseOrderItemId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int DrugId { get; set; }
        public int Quantity { get; set; }
        public int ReceivedQuantity { get; set; }
        public decimal UnitPrice { get; set; }

        public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
        public virtual Drug Drug { get; set; } = null!;
    }
}
