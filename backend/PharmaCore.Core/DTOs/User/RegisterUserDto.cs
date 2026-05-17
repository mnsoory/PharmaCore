using PharmaCore.Core.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required")]
        public string Firstname { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        public string Lastname { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number format")]
        [RegularExpression(@"^\+?[0-9]{6,15}$", ErrorMessage = "Phone number must be between 6 and 15 digits and can start with +")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password confirmation is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [Compare("Password", ErrorMessage = "Password and confirmation password do not match")]
        public string PasswordConfirmation { get; set; } = string.Empty;


        [Required(ErrorMessage = "User role is required")]
        [DefaultValue(UserRole.Pharmacist)]
        [EnumDataType(typeof(UserRole), ErrorMessage = "The provided role is invalid.")]
        public UserRole Role { get; set; } = UserRole.Pharmacist;
    }
}