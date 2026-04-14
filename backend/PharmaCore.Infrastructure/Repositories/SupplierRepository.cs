

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly AppDbContext _context;

        public SupplierRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Supplier supplier)
        {
            await _context.Suppliers.AddAsync(supplier);
        }

        public async Task<IEnumerable<Supplier>> GetAllAsync()
        {
            return await _context.Suppliers
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Supplier>> GetAllInActiveAsync()
        {
            return await _context.Suppliers
                .AsNoTracking()
                .IgnoreQueryFilters()
                .Where(s => !s.IsActive)
                .ToListAsync();
        }

        public async Task<Supplier?> GetByIdAsync(int id)
        {
            return await _context.Suppliers.FindAsync(id);
        }

        public async Task<Supplier?> GetByIdIgnoreQueryFilterAsync(int id)
        {
            return await _context.Suppliers
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(s => s.SupplierId == id);
        }

        public async Task<bool> ExistsByPhoneAsync(string phone)
        {
            return await _context.Suppliers
                .IgnoreQueryFilters()
                .AnyAsync(s => s.Phone == phone);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Suppliers.AnyAsync(d => d.SupplierId == id);
        }
    }
}
