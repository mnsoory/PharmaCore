

using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<UserRefreshToken?> GetByTokenAsync(string token);
        Task AddAsync(UserRefreshToken refreshToken);
        Task UpdateAsync(UserRefreshToken refreshToken);
        Task RevokeUserTokensAsync(int userId); 
    }
}
