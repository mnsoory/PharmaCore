

using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IDrugRepository
    {
        Task<Drug?> GetByIdAsync(int id);
        Task<IEnumerable<Drug>> GetAllActiveAsync();
        Task<IEnumerable<Drug>> SearchAsync(string searchTerm);
        Task AddAsync(Drug drug);
        Task<bool> TradeNameExistsAsync(string tradeName);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsCompositeAsync(string tradeName, string? concentration, string? form, string manufacturer);

        Task<int> CountByIdsAsync(ICollection<int> drugIds);
        Task<IEnumerable<Drug>> GetAllWithSettingsAndBatchesAsync();
        IQueryable<Drug> GetQueryable();

        Task<IEnumerable<TopSellingDrugDto>> GetTopSellingDrugsAsync(int count = 5, int days = 7);
    }
}