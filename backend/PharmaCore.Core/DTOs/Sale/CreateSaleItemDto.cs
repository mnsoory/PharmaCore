

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Sale
{
    public class CreateSaleItemDto
    {
        [Required(ErrorMessage = "Stock Batch ID is required")]
        public int BatchId { get; set; }

        [DefaultValue(1)]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }
}
