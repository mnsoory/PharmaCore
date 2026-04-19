

namespace PharmaCore.Core.DTOs.StockSetting
{
    public class StockSettingResponseDto
    {
        public int DrugId { get; set; }
        public string DrugTradeName { get; set; } = string.Empty;
        public string Concentration { get; set; } = string.Empty;
        public int MinimumStock { get; set; }
    }
}
