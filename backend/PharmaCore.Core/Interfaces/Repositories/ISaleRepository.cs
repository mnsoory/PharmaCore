

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface ISaleRepository
    {
        Task AddAsync(Sale sale);
        Task<Sale?> GetByIdAsync(int id);
        Task<IEnumerable<Sale>> GetAllAsync();
        Task<IEnumerable<Sale>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime from, DateTime to);
        Task<decimal> GetTotalRevenueAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountAsync(DateTime from, DateTime to);
    }
}
