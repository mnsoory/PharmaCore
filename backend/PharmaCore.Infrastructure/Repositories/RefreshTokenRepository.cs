

using Microsoft.EntityFrameworkCore;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Infrastructure.Data;

namespace PharmaCore.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AppDbContext _context;

        public RefreshTokenRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(UserRefreshToken refreshToken)
        {
            await _context.UserRefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<UserRefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.UserRefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token);
        }

        public async Task RevokeUserTokensAsync(int userId)
        {
            await _context.UserRefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(r => r.IsRevoked, true));
        }

        public async Task UpdateAsync(UserRefreshToken refreshToken)
        {
            _context.UserRefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }
    }
}
