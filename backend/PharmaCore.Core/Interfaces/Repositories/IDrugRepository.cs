

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IDrugRepository
    {
        Task<Drug?> GetByIdAsync(int id);
        Task<IEnumerable<Drug>> GetAllActiveAsync();
        Task<IEnumerable<Drug>> SearchAsync(string searchTerm);
        Task AddAsync(Drug drug);
        Task Update(Drug drug);
        Task<bool> ExistsAsync(string tradeName);

        Task<bool> ExistsCompositeAsync(string tradeName, string? concentration, string? form, string manufacturer);
    }
}