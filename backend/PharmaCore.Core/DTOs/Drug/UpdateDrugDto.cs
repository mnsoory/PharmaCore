using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Drug
{
    public class UpdateDrugDto
    {

        [Required(ErrorMessage = "Trade Name is required.")]
        [MaxLength(200)]
        public string TradeName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Generic Name is required.")]
        [MaxLength(200)]
        public string GenericName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Manufacturer is required.")]
        [MaxLength(150)]
        public string Manufacturer { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Form { get; set; }

        [MaxLength(50)]
        public string? Concentration { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public bool RequiresPrescription { get; set; }
    }
}