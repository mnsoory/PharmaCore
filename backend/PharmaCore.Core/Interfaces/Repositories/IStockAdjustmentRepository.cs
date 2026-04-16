

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IStockAdjustmentRepository
    {
        Task AddAsync(StockAdjustment adjustment);
        Task<StockAdjustment?> GetByIdAsync(int id);
        Task<IEnumerable<StockAdjustment>> GetByDrugIdAsync(int drugId);
    }
}
