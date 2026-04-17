

namespace PharmaCore.Core.DTOs.Sale
{
    public class SaleItemResponseDto
    {
        public int SaleItemId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal => Quantity * UnitPrice;
    }
}
