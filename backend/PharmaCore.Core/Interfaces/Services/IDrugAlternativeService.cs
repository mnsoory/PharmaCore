

using PharmaCore.Core.DTOs.DrugAlternative;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IDrugAlternativeService
    {
        Task AddAlternativeAsync(CreateDrugAlternativeDto dto);
        Task RemoveAlternativeAsync(int id1, int id2);
        Task<DrugAlternativeResponseDto> GetAlternativesAsync(int drugId);
    }
}
