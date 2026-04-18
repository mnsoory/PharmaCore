using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class SaleCancellationRepository : ISaleCancellationRepository
    {
        private readonly AppDbContext _context;

        public SaleCancellationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(SaleCancellation cancellation)
        {
            await _context.SaleCancellations.AddAsync(cancellation);
        }

        public async Task<SaleCancellation?> GetByIdAsync(int id)
        {
            return await _context.SaleCancellations
                .Include(sc => sc.Sale)
                .FirstOrDefaultAsync(sc => sc.SaleCancellationId == id);
        }

        public async Task<SaleCancellation?> GetBySaleIdAsync(int saleId)
        {
            return await _context.SaleCancellations
                .Include(sc => sc.Sale)
                .FirstOrDefaultAsync(sc => sc.SaleId == saleId);
        }

        public async Task<IEnumerable<SaleCancellation>> GetAllAsync()
        {
            return await _context.SaleCancellations
                .AsNoTracking()
                .Include(sc => sc.Sale)
                .ToListAsync();
        }
    }
}