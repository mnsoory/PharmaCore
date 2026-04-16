using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IStockBatchService
    {
        Task<StockBatchResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<StockBatchResponseDto>> GetByDrugIdAsync(int drugId);
        Task<IEnumerable<StockBatchResponseDto>> GetAvailableBatchesForSaleAsync(int drugId);
        Task<IEnumerable<StockBatchResponseDto>> GetExpiredBatchesAsync();
        Task UpdateRemainingQuantityAsync(int batchId, int quantityToSubtract);
        Task<StockBatch> CreateBatchEntityAsync(CreateStockBatchInternalDto dto);
    }
}