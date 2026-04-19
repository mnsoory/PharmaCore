

using PharmaCore.Core.DTOs.StockSetting;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IStockSettingService
    {
        Task<StockSettingResponseDto> GetByDrugIdAsync(int drugId);
        Task<IEnumerable<StockSettingResponseDto>> GetAllSettingsAsync();
        Task UpsertSettingAsync(StockSettingUpsertDto dto);
        Task DeleteSettingAsync(int drugId);
    }
}
