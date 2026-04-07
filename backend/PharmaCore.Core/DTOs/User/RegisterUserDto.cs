

using PharmaCore.Core.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required")]
        public string Firstname { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        public string Lastname { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DefaultValue(UserRole.Pharmacist)]
        [EnumDataType(typeof(UserRole), ErrorMessage = "The provided role is invalid.")]
        public UserRole Role { get; set; } = UserRole.Pharmacist;
    }
}
