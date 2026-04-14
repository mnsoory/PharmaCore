

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IPurchaseOrderRepository
    {
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder?> GetWithDetailsAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId);
        Task AddAsync(PurchaseOrder order);
    }
}
