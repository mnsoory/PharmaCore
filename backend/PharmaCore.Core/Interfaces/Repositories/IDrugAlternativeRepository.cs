

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IDrugAlternativeRepository
    {
        Task AddAsync(DrugAlternative alternative);
        Task DeleteAsync(int drugId, int altId);
        Task<bool> ExistsAsync(int id1, int id2);
        Task<IEnumerable<DrugAlternative>> GetByDrugIdAsync(int drugId);
    }
}
