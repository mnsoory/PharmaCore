

using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterUser(RegisterUserDto userDto);

        Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto);

        Task<UserResponseDto> GetByIdAsync(int userId);
        Task<IEnumerable<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto> GetByUsernameAsync(string username);

        Task UpdateUserAsync(int userId, UpdateUserDto updateUserDto);
        Task ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<bool> ToggleUserStatusAsync(int userId); 

        Task DeleteUserAsync(int userId);
    }
}
