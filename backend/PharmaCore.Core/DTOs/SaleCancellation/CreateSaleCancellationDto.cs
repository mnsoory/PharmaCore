

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.SaleCancellation
{
    public class CreateSaleCancellationDto
    {
        [Required(ErrorMessage = "Sale ID is required")]
        public int SaleId { get; set; }

        [Required(ErrorMessage = "Cancellation reason is required")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Reason must be between 10 and 500 characters")]
        public string Reason { get; set; } = string.Empty;
    }
}
