

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly AppDbContext _context;

        public PurchaseOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PurchaseOrder order)
        {
            await _context.PurchaseOrders.AddAsync(order);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllAsync()
        {
            return await _context.PurchaseOrders
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Drug)
                .ToListAsync();
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
        {
            return await _context.PurchaseOrders
                .FirstOrDefaultAsync(p => p.PurchaseOrderId ==id);
        }

        public async Task<PurchaseOrder?> GetWithDetailsAsync(int id)
        {
            return await _context.PurchaseOrders
                .Include(p => p.User)
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Drug)
                .FirstOrDefaultAsync(p => p.PurchaseOrderId == id);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetBySupplierIdAsync(int supplierId)
        {
            return await _context.PurchaseOrders
                .AsNoTracking()
                .Where(p => p.SupplierId == supplierId)
                .ToListAsync();
        }

        public async Task<bool> PurchaseOrderItemIdExistsAsync(int purchaseOrderId, int purchaseOrderItemId)
        {
            return await _context.purchaseOrderItems
                .AnyAsync(p => p.PurchaseOrderId == purchaseOrderId && p.PurchaseOrderItemId == purchaseOrderItemId);
        }
    }
}
