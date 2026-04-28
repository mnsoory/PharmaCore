using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class StockBatchRepository : IStockBatchRepository
    {
        private readonly AppDbContext _context;

        public StockBatchRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StockBatch?> GetByIdAsync(int id)
        {
            return await _context.StockBatches
                .Include(b => b.Drug)
                .Include(b => b.Supplier)
                .FirstOrDefaultAsync(b => b.StockBatchId == id);
        }

        public async Task<IEnumerable<StockBatch>> GetByDrugIdAsync(int drugId)
        {
            return await _context.StockBatches
                .Where(b => b.DrugId == drugId)
                .OrderBy(b => b.ExpiryDate)
                .Include(b => b.Drug)
                .Include(b => b.Supplier)
                .ToListAsync();
        }

        public async Task<IEnumerable<StockBatch>> GetActiveBatchesByDrugIdAsync(int drugId)
        {
            return await _context.StockBatches
                .Where(b => b.DrugId == drugId && b.RemainingQty > 0 && b.ExpiryDate > DateTime.UtcNow)
                .OrderBy(b => b.ExpiryDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<StockBatch>> GetExpiredBatchesAsync()
        {
            return await _context.StockBatches
                .Where(b => b.ExpiryDate <= DateTime.UtcNow && b.RemainingQty > 0)
                .ToListAsync();
        }

        public async Task AddAsync(StockBatch batch)
        {
            await _context.StockBatches.AddAsync(batch);
        }

        public async Task AddRangeAsync(IEnumerable<StockBatch> batches)
        {
            await _context.StockBatches.AddRangeAsync(batches);
        }


        public async Task<bool> HasAnyUsageByItemsAsync(List<int> itemIds)
        {
            return await _context.StockBatches
                .AnyAsync(b => itemIds.Contains(b.PurchaseOrderItemId) && b.RemainingQty < b.Quantity);
        }

        public async Task<IEnumerable<StockBatch>> GetByItemIdsAsync(List<int> itemIds)
        {
            return await _context.StockBatches
                .Where(b => itemIds.Contains(b.PurchaseOrderItemId))
                .ToListAsync();
        }

        public void RemoveRange(IEnumerable<StockBatch> batches)
        {
            _context.StockBatches.RemoveRange(batches);
        }

        public async Task<IEnumerable<StockBatch>> GetAllExpiringSoonAsync(int maxDays)
        {
            var thresholdDate = DateTime.UtcNow.AddDays(maxDays);
            return await _context.StockBatches
                .AsNoTracking()
                .Include(b => b.Drug)
                .Include(b => b.Supplier)
                .Where(b => b.ExpiryDate <= thresholdDate
                         && b.ExpiryDate > DateTime.UtcNow
                         && b.Quantity > 0)
                .OrderBy(b => b.ExpiryDate)
                .ToListAsync();
        }

        public async Task<int> GetDamagedDrugsCountAsync()
        {
            return await _context.StockAdjustments
                .Where(a => a.Reason == StockAdjustmentType.Damage.ToString())
                .SumAsync(a => a.Quantity);
        }
    }
}
