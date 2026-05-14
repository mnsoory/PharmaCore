

using PharmaCore.Core.Enums;

namespace PharmaCore.Core.Entities
{
    public class Sale
    {
        public int SaleId { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public DateTime SaleDate { get; set; }

        public virtual User User { get; set; }
        public virtual SaleCancellation Cancellation { get; set; } = null!;
        public ICollection<SaleItem> SaleItems { get; set; } = new HashSet<SaleItem>();
    }
}
