

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.Supplier
{
    public class SupplierResponseDto
    {
        public int SupplierId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Company { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
