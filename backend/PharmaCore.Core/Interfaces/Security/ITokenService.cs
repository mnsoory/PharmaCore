

using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Security
{
    public interface ITokenService
    {
        TokenResponseDto GenerateToken(User user);
        string GenerateRefreshToken();

        string GetJtiFromExpiredToken(string token);

    }
}
