

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IStockSettingRepository
    {
        Task<StockSetting?> GetByDrugIdAsync(int drugId);
        Task<IEnumerable<StockSetting>> GetAllWithDrugsAsync();
        Task UpsertAsync(StockSetting setting);
        void Delete(StockSetting setting);
    }
}
