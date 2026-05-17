

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Current password is required")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "New password is required")]
        [MinLength(8, ErrorMessage = "New password must be at least 8 characters")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match")]
        public string PasswordConfirmation { get; set; } = string.Empty;
    }
}
