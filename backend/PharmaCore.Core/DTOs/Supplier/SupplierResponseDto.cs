

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Supplier
{
    public class SupplierResponseDto
    {
        public int SupplierId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string? Email { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
