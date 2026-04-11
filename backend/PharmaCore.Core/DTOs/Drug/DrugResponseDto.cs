

namespace PharmaCore.Core.DTOs.Drug
{
    public class DrugResponseDto
    {
        public int DrugId { get; set; }
        public string TradeName { get; set; } = string.Empty;
        public string GenericName { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Form { get; set; } = string.Empty;
        public string Concentration { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool RequiresPrescription { get; set; }
    }
}
