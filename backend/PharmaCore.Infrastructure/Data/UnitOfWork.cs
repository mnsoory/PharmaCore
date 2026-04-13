using Microsoft.EntityFrameworkCore.Storage;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Repositories;

namespace PharmaCore.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction _transaction;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            RefreshTokens = new RefreshTokenRepository(_context);
            Drugs = new DrugRepository(_context);
            Suppliers = new SupplierRepository(_context);
            PurchaseOrders = new PurchaseOrderRepository(_context);
        }

        public IUserRepository Users { get; private set; }
        public IRefreshTokenRepository RefreshTokens { get; private set; }
        public IDrugRepository Drugs { get; private set; }
        public ISupplierRepository Suppliers { get; private set; }
        public IPurchaseOrderRepository PurchaseOrders { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction == null)
            {
                _transaction = await _context.Database.BeginTransactionAsync();
            }
        }

        public async Task CommitAsync()
        {
            try
            {
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackAsync();
                throw;
            }
            finally
            {
                await DisposeTransactionAsync();
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await DisposeTransactionAsync();
            }
        }

        private async Task DisposeTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null; 
            }
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}