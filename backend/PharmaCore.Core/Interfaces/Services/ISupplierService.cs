

using PharmaCore.Core.DTOs.Supplier;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface ISupplierService
    {
        Task<SupplierResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<SupplierResponseDto>> GetAllAsync();

        Task<IEnumerable<SupplierResponseDto>> GetAllInActiveAsync();
        Task <SupplierResponseDto> CreateAsync(CreateSupplierDto createDto);
        Task UpdateAsync(int id, UpdateSupplierDto updateDto);
        Task<bool> ToggleSupplierStatusAsync(int id);
    }
}
