

using PharmaCore.Core.DTOs.StockAdjustment;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IStockAdjustmentService
    {
        Task<StockAdjustmentResponseDto> CreateAdjustmentAsync(CreateStockAdjustmentDto dto);
        Task<IEnumerable<StockAdjustmentResponseDto>> GetAdjustmentsByDrugIdAsync(int drugId);
    }
}
