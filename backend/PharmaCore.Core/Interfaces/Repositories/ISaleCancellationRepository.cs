

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface ISaleCancellationRepository
    {
        Task AddAsync(SaleCancellation cancellation);
        Task<SaleCancellation?> GetByIdAsync(int id);
        Task<SaleCancellation?> GetBySaleIdAsync(int saleId);
        Task<IEnumerable<SaleCancellation>> GetAllAsync();
    }
}
