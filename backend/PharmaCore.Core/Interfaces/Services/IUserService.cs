

using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;

namespace PharmaCore.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterAsync(RegisterUserDto userDto);

        Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto);

        Task<UserResponseDto> GetByIdAsync(int userId);
        Task<IEnumerable<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto> GetByUsernameAsync(string username);

        Task UpdateAsync(int userId, UpdateUserDto updateUserDto);
        Task ChangePasswordAsync(ChangePasswordDto changePasswordDto);
        Task<bool> ToggleUserStatusAsync(int userId); 

        Task UpdateUserRoleAsync(int userId, string newRole);

        Task DeleteUserAsync(int userId);

        Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto requestDto);

        Task RevokeTokenAsync(string token);
    }
}
