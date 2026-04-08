

using PharmaCore.Core.Enums;

namespace PharmaCore.Core.DTOs.User
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public UserRole Role { get; set; }
        public bool IsActive { get; set; }
    }
}
