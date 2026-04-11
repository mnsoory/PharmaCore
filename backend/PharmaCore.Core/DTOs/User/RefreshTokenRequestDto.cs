

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class RefreshTokenRequestDto
    {
        [Required(ErrorMessage = "Expired Access Token is required.")]
        public string Token { get; set; } = string.Empty;

        [Required(ErrorMessage = "Refresh Token is required.")]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
