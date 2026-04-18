

namespace PharmaCore.Core.DTOs.DrugAlternative
{
    public class DrugAlternativeResponseDto
    {
        public int DrugId { get; set; }
        public string TradeName { get; set; } = string.Empty;
        public string ScientificName { get; set; } = string.Empty;
        public List<AlternativeItemDto> Alternatives { get; set; } = new List<AlternativeItemDto>();
    }
}
