using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.StockBatch
{
    public class CreateStockBatchInternalDto
    {
        [Required]
        public int DrugId { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [Required]
        public int PurchaseOrderId { get; set; }

        [Required]
        public int PurchaseOrderItemId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal PurchasePrice { get; set; }

        [Required]
        [StringLength(50)]
        public string BatchNumber { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public DateTime ProductionDate { get; set; }
    }
}