

using PharmaCore.Core.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Sale
{
    public class CreateSaleDto
    {
        [Required(ErrorMessage = "Sale items are required")]
        [MinLength(1, ErrorMessage = "At least one item must be added to the sale")]
        public List<CreateSaleItemDto> SaleItems { get; set; } = new();

        [DefaultValue(0)]
        [Range(0, double.MaxValue, ErrorMessage = "Discount cannot be negative")]
        public decimal Discount { get; set; }

        [Required(ErrorMessage = "Payment method is required")]
        [EnumDataType(typeof(PaymentMethod), ErrorMessage = "Invalid payment method")]
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
