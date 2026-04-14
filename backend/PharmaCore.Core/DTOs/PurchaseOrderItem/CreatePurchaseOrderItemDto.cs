

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.PurchaseOrderItem
{
    public class CreatePurchaseOrderItemDto
    {
        [Required]
        public int DrugId { get; set; }

        [Required]
        [DefaultValue(1)]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [DefaultValue(1.00)]
        [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
        public decimal UnitPrice { get; set; }
    }
}
