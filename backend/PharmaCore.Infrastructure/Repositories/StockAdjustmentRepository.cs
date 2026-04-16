

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class StockAdjustmentRepository : IStockAdjustmentRepository
    {
        private readonly AppDbContext _context;

        public StockAdjustmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(StockAdjustment adjustment)
        {
            await _context.StockAdjustments.AddAsync(adjustment);
        }

        public async Task<StockAdjustment?> GetByIdAsync(int id)
        {
            return await _context.StockAdjustments
                .Include(x => x.StockBatch)
                    .ThenInclude(s => s.Drug)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.StockAdjustmentId == id);
        }

        public async Task<IEnumerable<StockAdjustment>> GetByDrugIdAsync(int drugId)
        {
            return await _context.StockAdjustments
                .Include(x => x.StockBatch)
                    .ThenInclude(s => s.Drug)
                .Include(x => x.User)
                .Where(x => x.StockBatch.DrugId == drugId)
                .OrderByDescending(x => x.AdjustmentDate)
                .ToListAsync();
        }
    }
}
