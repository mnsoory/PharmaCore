

using PharmaCore.Core.DTOs.PurchaseOrderItem;
using PharmaCore.Core.Enums;

namespace PharmaCore.Core.DTOs.PurchaseOrder
{
    public class PurchaseOrderResponseDto
    {
        public int PurchaseOrderId { get; set; }
        public PurchaseOrderStatus Status { get; set; } 
        public DateTime OrderDate { get; set; }

        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;

        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;

        public List<PurchaseOrderItemResponseDto> Items { get; set; } = new();
    }
}
