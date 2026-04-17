

using PharmaCore.Core.DTOs.Sale;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface ISaleService
    {
        Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto dto);

        Task<SaleResponseDto> GetSaleByIdAsync(int id);

        Task<IEnumerable<SaleResponseDto>> GetCurrentUserSalesAsync(); 
        Task<IEnumerable<SaleResponseDto>> GetSalesByUserIdAsync(int userId);

        Task<IEnumerable<SaleResponseDto>> GetSalesReportAsync(DateTime from, DateTime to);

        Task<decimal> GetRevenueReportAsync(DateTime from, DateTime to);

        Task<int> GetSalesCountReportAsync(DateTime from, DateTime to);

        Task<IEnumerable<SaleResponseDto>> GetAllSalesAsync();
    }
}
