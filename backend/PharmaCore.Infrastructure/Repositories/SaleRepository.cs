

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class SaleRepository : ISaleRepository
    {
        private readonly AppDbContext _context;

        public SaleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Sale sale)
        {
            await _context.Sales.AddAsync(sale);
        }

        public async Task<Sale?> GetByIdAsync(int id)
        {
            return await _context.Sales
                .Include(s => s.User)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Drug)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Batch)
                .FirstOrDefaultAsync(s => s.SaleId == id);
        }

        public async Task<IEnumerable<Sale>> GetAllAsync()
        {
            return await _context.Sales
                .AsNoTracking()
                .Include(s => s.User)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Drug)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Batch)
                .OrderByDescending(s => s.SaleDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sale>> GetByUserIdAsync(int userId)
        {
            return await _context.Sales
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .Include(s => s.User)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Drug)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Batch)
                .OrderByDescending(s => s.SaleDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Sales
                .AsNoTracking()
                .Include(s => s.User)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Drug)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Batch)
                .Where(s => s.SaleDate >= from && s.SaleDate <= to)
                .OrderByDescending(s => s.SaleDate)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime from, DateTime to)
        {
            return await _context.Sales
                .Where(s => s.SaleDate >= from && s.SaleDate <= to)
                .SumAsync(s => s.TotalAmount);
        }

        public async Task<int> GetSalesCountAsync(DateTime from, DateTime to)
        {
            return await _context.Sales
                .CountAsync(s => s.SaleDate >= from && s.SaleDate <= to);
        }

        public async Task<IEnumerable<DailySalesDto>> GetWeeklySalesAsync()
        {
            var lastSevenDays = DateTime.UtcNow.Date.AddDays(-6);

            return await _context.Sales
                .Where(s => s.SaleDate >= lastSevenDays)
                .GroupBy(s => s.SaleDate.Date)
                .Select(g => new DailySalesDto
                {
                    Date = g.Key,
                    TotalSales = g.Sum(s => s.TotalAmount)
                })
                .OrderBy(d => d.Date)
                .ToListAsync();
        }
    }
}
