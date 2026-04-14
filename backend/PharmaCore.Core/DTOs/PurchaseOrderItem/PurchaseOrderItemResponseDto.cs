

namespace PharmaCore.Core.DTOs.PurchaseOrderItem
{
    public class PurchaseOrderItemResponseDto
    {
        public int DrugId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
