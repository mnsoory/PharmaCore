

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class LoginRequestDto
    {
        [Required]
        public string Identifier { get; set; } = string.Empty; // Email || Username

        [Required]
        public string Password { get; set; } = string.Empty;
        public bool  RememberMe { get; set; } = false;
    }
}
