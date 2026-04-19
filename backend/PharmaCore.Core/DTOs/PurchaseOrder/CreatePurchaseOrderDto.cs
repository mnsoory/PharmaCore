

using PharmaCore.Core.DTOs.PurchaseOrderItem;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.PurchaseOrder
{
    public class CreatePurchaseOrderDto
    {
        [Required(ErrorMessage = "Supplier ID is required")]
        public int SupplierId { get; set; }

        [Required(ErrorMessage = "Order items are required")]
        [MinLength(1, ErrorMessage = "Purchase order must contain at least one item")]
        public List<CreatePurchaseOrderItemDto> Items { get; set; } = new();
    }
}
