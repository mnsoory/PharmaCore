

using Microsoft.AspNetCore.Http;
using PharmaCore.Core.Exceptions;
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
            var userIdClaim = _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int id))
            {
                throw new UnauthorizedException("User identification is missing or invalid in the current context.");
            }

            return id;
        }

        public string GetUserRole()
        {
            var role = _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrEmpty(role))
            {
                throw new UnauthorizedException("User role is missing in the current context.");
            }

            return role;
        }
    }
}
