

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Supplier
{
    public class CreateSupplierDto
    {
        [Required(ErrorMessage = "Supplier name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string SupplierName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(150, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Contact Person name is required")]
        [StringLength(200, ErrorMessage = "Company name cannot exceed 200 characters")]
        public string ContactPerson { get; set; } = string.Empty;
    }
}
