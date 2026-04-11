

using PharmaCore.Core.DTOs.Drug;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IDrugService
    {
        Task<IEnumerable<DrugResponseDto>> GetAllAsync();
        Task<DrugResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<DrugResponseDto>> SearchAsync(string searchTerm);

        Task<DrugResponseDto> CreateAsync(CreateDrugDto createDto);
        Task UpdateAsync(int id, UpdateDrugDto updateDto);

        Task DeleteAsync(int id);

        Task<bool> IsTradeNameExistsAsync(string tradeName);
    }
}
