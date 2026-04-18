using PharmaCore.Core.Interfaces.Repositories;

namespace PharmaCore.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // Repositories
        IUserRepository Users { get; }
        IRefreshTokenRepository RefreshTokens { get; }
        IDrugRepository Drugs { get; }
        ISupplierRepository Suppliers { get; }
        IPurchaseOrderRepository PurchaseOrders { get; }
        IStockBatchRepository StockBatches { get; }
        IStockAdjustmentRepository StockAdjustments { get; }
        ISaleRepository Sales { get; }
        ISaleCancellationRepository SaleCancellations { get; }

        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}