

namespace PharmaCore.Core.DTOs.User
{
    public class ChangePasswordDto
    {
        public string NewPassword { get; set; }
        public string PasswordConfirmation { get; set; }
        public string CurrentPassword { get; set; }
    }
}
