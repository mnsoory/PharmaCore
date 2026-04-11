

namespace PharmaCore.Core.DTOs.User
{
    public class TokenResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string JwtId { get; set; }
        public DateTime Expiration { get; set; }
    }
}
