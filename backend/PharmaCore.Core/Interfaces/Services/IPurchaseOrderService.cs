

using PharmaCore.Core.DTOs.PurchaseOrder;
using PharmaCore.Core.Enums;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IPurchaseOrderService
    {
        Task<PurchaseOrderResponseDto> GetByIdAsync(int id);
        Task<IEnumerable<PurchaseOrderResponseDto>> GetAllAsync();
        Task<PurchaseOrderResponseDto> CreateAsync(CreatePurchaseOrderDto createDto);
        Task UpdateStatusAsync(int id, PurchaseOrderStatus newStatus);
    }
}
