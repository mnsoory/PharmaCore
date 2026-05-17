

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Supplier
{
    public class UpdateSupplierDto
    {
        [Required(ErrorMessage = "Supplier name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string SupplierName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?[0-9]{6,15}$", ErrorMessage = "Phone number must be between 6 and 15 digits and can start with +")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Contact Person name is required")]
        [StringLength(200, ErrorMessage = "Contact Person cannot exceed 200 characters")]
        public string ContactPerson { get; set; } = string.Empty;

        [Required(ErrorMessage = "Active status is required")]
        public bool IsActive { get; set; }
    }
}
