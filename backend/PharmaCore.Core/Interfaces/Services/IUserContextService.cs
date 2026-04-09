

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IUserContextService
    {
        int GetUserId();
        string? GetUserRole();
    }
}
