

using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.PurchaseOrder
{
    public class PurchaseOrderUpdateStatusDto
    {
        [Required]
        [EnumDataType(typeof(PurchaseOrderStatus), ErrorMessage = "Selected status is not supported.")]
        public string NewStatus { get; set; } = string.Empty;
        public List<BatchUpdateDataDto>? ItemsData { get; set; }
    }
}
