

using PharmaCore.Core.Interfaces.Security;
using BC = BCrypt.Net.BCrypt;

namespace PharmaCore.Infrastructure.Security
{
    public class PasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password) => BC.HashPassword(password);

        public bool VerifyPassword(string password, string passwordHash) => BC.Verify(password, passwordHash);
    }
}
