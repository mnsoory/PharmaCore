

namespace PharmaCore.Core.DTOs.Sale
{
    public class SaleResponseDto
    {
        public int SaleId { get; set; }
        public string Username { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime SaleDate { get; set; }
        public List<SaleItemResponseDto> SaleItems { get; set; } = new();
    }
}
