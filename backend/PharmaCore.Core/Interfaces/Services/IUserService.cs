

using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<int> RegisterUser(RegisterUserDto userDto);
    }
}
