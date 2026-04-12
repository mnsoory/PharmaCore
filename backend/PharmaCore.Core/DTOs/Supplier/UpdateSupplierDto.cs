

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Supplier
{
    public class UpdateSupplierDto
    {
        [Required(ErrorMessage = "Supplier name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Company name is required")]
        [StringLength(200, ErrorMessage = "Company name cannot exceed 200 characters")]
        public string Company { get; set; } = string.Empty;

        [Required(ErrorMessage = "Active status is required")]
        public bool IsActive { get; set; }
    }
}
