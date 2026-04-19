using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IStockBatchRepository
    {
        Task<StockBatch?> GetByIdAsync(int id);
        Task<IEnumerable<StockBatch>> GetByDrugIdAsync(int drugId);
        Task<IEnumerable<StockBatch>> GetActiveBatchesByDrugIdAsync(int drugId);
        Task<IEnumerable<StockBatch>> GetExpiredBatchesAsync();
        Task AddAsync(StockBatch batch);
        Task AddRangeAsync(IEnumerable<StockBatch> batches);
        Task<bool> HasAnyUsageByItemsAsync(List<int> itemIds);
        Task<IEnumerable<StockBatch>> GetByItemIdsAsync(List<int> itemIds);
        void RemoveRange(IEnumerable<StockBatch> batches);
        Task<IEnumerable<StockBatch>> GetAllExpiringSoonAsync(int maxDays);
    }
}