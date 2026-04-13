

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class DrugRepository : IDrugRepository
    {
        private readonly AppDbContext _context;

        public DrugRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Drug drug)
        {
            await _context.Drugs.AddAsync(drug);
        }

        public async Task<bool> ExistsAsync(string tradeName)
        {
            return await _context.Drugs.AnyAsync(d => d.TradeName == tradeName.Trim());
        }

        public async Task<bool> ExistsCompositeAsync(string tradeName, string? concentration, string? form, string manufacturer)
        {
            var trimmedName = tradeName.Trim();
            var trimmedConc = concentration?.Trim();
            var trimmedForm = form?.Trim();
            var trimmedMfr = manufacturer.Trim();

            return await _context.Drugs
                .AnyAsync(d => d.TradeName == trimmedName
                            && d.Concentration == trimmedConc
                            && d.Form == trimmedForm
                            && d.Manufacturer == trimmedMfr);
        }

        public async Task<IEnumerable<Drug>> GetAllActiveAsync()
        {
            return await _context.Drugs
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Drug?> GetByIdAsync(int id)
        {
            return await _context.Drugs.FindAsync(id);
        }

        public async Task<IEnumerable<Drug>> SearchAsync(string searchTerm)
        {
            searchTerm = searchTerm.Trim();
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<Drug>();

            return await _context.Drugs
                .AsNoTracking()
                .Where(d => d.TradeName.Contains(searchTerm) || d.GenericName.Contains(searchTerm))
                .ToListAsync();
        }

        public Task Update(Drug drug)
        {
            _context.Drugs.Update(drug);
            return Task.CompletedTask;
        }
    }
}
