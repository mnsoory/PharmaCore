

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class DrugAlternativeRepository : IDrugAlternativeRepository
    {
        private readonly AppDbContext _context;

        public DrugAlternativeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(DrugAlternative alternative)
        {
            await _context.DrugAlternatives.AddAsync(alternative);
        }

        public async Task DeleteAsync(int id1, int id2)
        {
            var firstId = Math.Min(id1, id2);
            var secondId = Math.Max(id1, id2);
            var entity = await _context.DrugAlternatives.FindAsync(firstId, secondId);
            if (entity != null) _context.DrugAlternatives.Remove(entity);
        }

        public async Task<bool> ExistsAsync(int id1, int id2)
        {
            var firstId = Math.Min(id1, id2);
            var secondId = Math.Max(id1, id2);
            return await _context.DrugAlternatives.AnyAsync(da => da.DrugId == firstId && da.AlternativeDrugId == secondId);
        }

        public async Task<IEnumerable<DrugAlternative>> GetByDrugIdAsync(int drugId)
        {
            return await _context.DrugAlternatives
                .Include(da => da.Drug)
                .Include(da => da.AlternativeDrug)
                .Where(da => da.DrugId == drugId || da.AlternativeDrugId == drugId)
                .ToListAsync();
        }
    }
}
