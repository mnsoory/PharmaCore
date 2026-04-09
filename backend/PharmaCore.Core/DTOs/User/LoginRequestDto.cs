

namespace PharmaCore.Core.DTOs.User
{
    public class LoginRequestDto
    {
        public string Identifier { get; set; } // Email || Username
        public string Password { get; set; }
    }
}
