

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

        Task<SalesSummaryDto> GetSalesSummaryAsync(DateTime from, DateTime to);

        Task<IEnumerable<SaleResponseDto>> GetAllSalesAsync();
        Task<IEnumerable<DailySalesDto>> GetWeeklySalesPerformanceAsync();
    }
}
