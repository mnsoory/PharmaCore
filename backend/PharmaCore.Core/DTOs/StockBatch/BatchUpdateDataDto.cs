

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.StockBatch
{
    public class BatchUpdateDataDto
    {
        [Required(ErrorMessage = "Item ID is required")]
        public int PurchaseOrderItemId { get; set; }

        [Required(ErrorMessage = "Batch number is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Batch number must be between 3 and 50 characters")]
        public string BatchNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Quantity is required")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Expiry date is required")]
        [DataType(DataType.Date)]
        public DateTime ExpiryDate { get; set; }

        [Required(ErrorMessage = "Production date is required")]
        [DataType(DataType.Date)]
        public DateTime ProductionDate { get; set; }
    }
}
