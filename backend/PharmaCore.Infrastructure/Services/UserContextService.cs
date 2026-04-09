

using Microsoft.AspNetCore.Http;
using PharmaCore.Core.Interfaces.Services;
using System.Security.Claims;

namespace PharmaCore.Infrastructure.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public UserContextService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public int GetUserId()
        {
            var userId = _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userId, out int id) ? id : 0;
        }

        public string? GetUserRole()
        {
            return _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
        }
    }
}
