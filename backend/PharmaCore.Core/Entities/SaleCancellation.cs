

namespace PharmaCore.Core.Entities
{
    public class SaleCancellation
    {
        public int SaleCancellationId { get; set; }
        public int SaleId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime CancelledAt { get; set; }

        public virtual Sale Sale { get; set; } = null!;
    }
}
