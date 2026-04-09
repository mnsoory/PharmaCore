
using Microsoft.IdentityModel.Tokens;
using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Interfaces.Security;
using PharmaCore.Core.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PharmaCore.Infrastructure.Security
{
    public class TokenService(JwtSettings jwtSettings) : ITokenService
    {
        private readonly byte[] _key = Encoding.UTF8.GetBytes(jwtSettings.SigningKey);
        public TokenResponseDto GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()), 
                new(ClaimTypes.Name, user.Username),                    
                new(ClaimTypes.Email, user.Email),                      
                new(ClaimTypes.Role, user.Role.ToString()),             
                new("FullName", $"{user.Firstname} {user.Lastname}"),   
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var expiration = DateTime.UtcNow.AddMinutes(jwtSettings.DurationInMinutes);

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

            return new TokenResponseDto { AccessToken = accessToken, Expiration = expiration };
            
        }
    }
}
