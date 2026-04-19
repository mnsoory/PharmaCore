using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class StockSettingRepository : IStockSettingRepository
    {
        private readonly AppDbContext _context;

        public StockSettingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StockSetting?> GetByDrugIdAsync(int drugId)
        {
            return await _context.StockSettings
                .Include(s => s.Drug)
                .FirstOrDefaultAsync(s => s.DrugId == drugId);
        }

        public async Task<IEnumerable<StockSetting>> GetAllWithDrugsAsync()
        {
            return await _context.StockSettings
                .AsNoTracking()
                .Include(s => s.Drug)
                .ToListAsync();
        }

        public async Task UpsertAsync(StockSetting setting)
        {
            var existingSetting = await _context.StockSettings
                .FirstOrDefaultAsync(s => s.DrugId == setting.DrugId);

            if (existingSetting == null)
            {
                await _context.StockSettings.AddAsync(setting);
            }
            else
            {
                existingSetting.MinimumStock = setting.MinimumStock;
                _context.StockSettings.Update(existingSetting);
            }
        }

        public void Delete(StockSetting setting)
        {
            _context.StockSettings.Remove(setting);
        }
    }
}