

using PharmaCore.Core.DTOs.Sale;

namespace PharmaCore.Core.DTOs.SaleCancellation
{
    public class SaleCancellationResponseDto
    {
        public int SaleCancellationId { get; set; }
        public int SaleId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime CancelledAt { get; set; }
        public SaleResponseDto Sale { get; set; } = null!;
    }
}
