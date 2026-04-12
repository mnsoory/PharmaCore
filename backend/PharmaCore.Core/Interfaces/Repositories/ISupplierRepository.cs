

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface ISupplierRepository
    {
        Task<Supplier?> GetByIdAsync(int id);
        Task<Supplier?> GetByIdIgnoreQueryFilterAsync(int id);
        Task<IEnumerable<Supplier>> GetAllAsync();

        Task<IEnumerable<Supplier>> GetAllInActiveAsync();
        Task AddAsync(Supplier supplier);
        Task UpdateAsync(Supplier supplier);
        Task<bool> ExistsByPhoneAsync(string phone);
    }
}
