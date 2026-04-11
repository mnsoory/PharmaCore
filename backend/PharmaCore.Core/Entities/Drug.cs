

namespace PharmaCore.Core.Entities
{
    public class Drug
    {
        public int DrugId { get; set; }
        public string TradeName { get; set; } = string.Empty;
        public string GenericName { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty; 

        public string? Form { get; set; }
        public string? Concentration { get; set; }
        public string? Category { get; set; }
        public bool RequiresPrescription { get; set; }
        public bool IsDeleted { get; set; }
    }
}
