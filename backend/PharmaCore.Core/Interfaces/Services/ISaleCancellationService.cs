using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.DTOs.SaleCancellation;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface ISaleCancellationService
    {
        Task<SaleCancellationResponseDto> CancelSaleAsync(CreateSaleCancellationDto dto);
        Task<SaleCancellationResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<SaleResponseDto>> GetAllCancelledSalesAsync();
    }
}