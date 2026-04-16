

using PharmaCore.Core.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.StockAdjustment
{
    public class CreateStockAdjustmentDto
    {
        [Required(ErrorMessage = "Stock Batch ID is required")]
        public int StockBatchId { get; set; }

        [DefaultValue(1)]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than zero")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Reason is required")]
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Reason must be between 5 and 500 characters")]
        public string Reason { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adjustment type is required")]
        [EnumDataType(typeof(StockAdjustmentType))]
        public string AdjustmentType { get; set; } = string.Empty;
    }
}
