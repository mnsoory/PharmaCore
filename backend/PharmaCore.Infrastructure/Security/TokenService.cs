
using Microsoft.IdentityModel.Tokens;
using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Interfaces.Security;
using PharmaCore.Core.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PharmaCore.Infrastructure.Security
{
    public class TokenService(JwtSettings jwtSettings) : ITokenService
    {
        private readonly byte[] _key = Encoding.UTF8.GetBytes(jwtSettings.SigningKey);
        public TokenResponseDto GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var jti = Guid.NewGuid().ToString();
            var expiration = DateTime.UtcNow.AddMinutes(jwtSettings.DurationInMinutes);

            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()), 
                new(ClaimTypes.Name, user.Username),                    
                new(ClaimTypes.Email, user.Email),                      
                new(ClaimTypes.Role, user.Role.ToString()),             
                new("FullName", $"{user.Firstname} {user.Lastname}"),   
                new(JwtRegisteredClaimNames.Jti, jti)
            };


            var tokenDescripter = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiration,
                Issuer = jwtSettings.Issuer,
                Audience = jwtSettings.Audience,

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_key), 
                SecurityAlgorithms.HmacSha256)
            };

            var securityToken = tokenHandler.CreateToken(tokenDescripter);
            var accessToken = tokenHandler.WriteToken(securityToken);

            return new TokenResponseDto
            {
                AccessToken = accessToken,
                Expiration = expiration,
                JwtId = jti
            };
            
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string GetJtiFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateLifetime = false,

                ValidateAudience = true,
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SigningKey)),
                ValidateIssuerSigningKey = true
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token algorithm");
            }

            var jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

            if (string.IsNullOrEmpty(jti))
            {
                throw new SecurityTokenException("JTI claim is missing from token");
            }

            return jti;
        }
    }
}
