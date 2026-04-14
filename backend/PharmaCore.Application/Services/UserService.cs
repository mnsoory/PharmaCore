

using AutoMapper;
using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Core.Interfaces.Security;
using PharmaCore.Core.Interfaces.Services;
using System.Threading.Tasks;

namespace PharmaCore.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly IUserContextService _userContextService;

        public UserService(IUnitOfWork uow, IPasswordHasher passwordHasher, IMapper mapper,
            ITokenService tokenService, IUserContextService userContextService)
        {
            _uow = uow;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _tokenService = tokenService;
            _userContextService = userContextService;
        }

        public async Task<UserResponseDto> RegisterAsync(RegisterUserDto userDto)
        {
            if (await _uow.Users.UsernameExistsAsync(userDto.Username))
                throw new BusinessException($"Username '{userDto.Username}' is already taken.");

            if (await _uow.Users.EmailExistsAsync(userDto.Email))
                throw new BusinessException($"Email '{userDto.Email}' is already registered.");

            if (userDto.Phone is not null && await _uow.Users.PhoneExistsAsync(userDto.Phone))
                throw new BusinessException($"Phone number '{userDto.Phone}' is already in use.");

            User userEntity = _mapper.Map<User>(userDto);
            userEntity.PasswordHash = _passwordHasher.HashPassword(userDto.Password);

            await _uow.Users.AddAsync(userEntity);
            await _uow.CompleteAsync();

            return _mapper.Map<UserResponseDto>(userEntity);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await _uow.Users.GetByIdentifierAsync(loginDto.Identifier);



            if (user == null || !_passwordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Invalid username/email or password.");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedException("Your account is deactivated. Please contact admin.");
            }

            var authResponse = _mapper.Map<AuthResponseDto>(user);
            var tokenResponse = _tokenService.GenerateToken(user);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();


            var refreshTokenEntity = new UserRefreshToken
            {
                Token = refreshTokenValue,
                JwtId = tokenResponse.JwtId,
                UserId = user.UserId,
                ExpiryDate = DateTime.UtcNow.AddDays(7)
            };

            await _uow.RefreshTokens.AddAsync(refreshTokenEntity);
            await _uow.CompleteAsync();

            authResponse.Token = tokenResponse.AccessToken;
            authResponse.ExpiresAt = tokenResponse.Expiration;
            authResponse.RefreshToken = refreshTokenValue;
            return authResponse;
        }

        public async Task<UserResponseDto> GetByIdAsync(int userId)
        {
            User? user = await _uow.Users.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException($"User with ID: {userId} was not found.");

            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
        {
            var users = await _uow.Users.GetAllAsync();

            var usersDto = _mapper.Map<IEnumerable<UserResponseDto>>(users);
            return usersDto;
        }

        public async Task<UserResponseDto> GetByUsernameAsync(string username)
        {
            User? user = await _uow.Users.GetByUsernameAsync(username);

            if (user == null)
                throw new NotFoundException($"User with Username: {username} was not found.");

            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task UpdateAsync(int userId, UpdateUserDto updateUserDto)
        {
            var currentUserId = _userContextService.GetUserId();
            var currentUserRole = _userContextService.GetUserRole();

            if (currentUserRole != UserRole.Admin.ToString() && currentUserId != userId)
            {
                throw new UnauthorizedException("You do not have permission to modify another user's data.");
            }

            var user = await _uow.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            if (user.Email != updateUserDto.Email && await _uow.Users.EmailExistsAsync(updateUserDto.Email))
            {
                throw new BusinessException("This email is already registered to another user.");
            }

            if (user.Phone != updateUserDto.Phone && await _uow.Users.PhoneExistsAsync(updateUserDto.Phone))
            {
                throw new BusinessException("This phone number is already in use.");
            }

            _mapper.Map(updateUserDto, user);

            await _uow.CompleteAsync();
        }

        public async Task ChangePasswordAsync(ChangePasswordDto dto)
        {
            var currentUserId = _userContextService.GetUserId();

            var user = await _uow.Users.GetByIdAsync(currentUserId);
            if (user == null) throw new NotFoundException("User not found.");

            if (dto.NewPassword == dto.CurrentPassword)
                throw new BusinessException("New password must be different from the current password.");

            if (dto.NewPassword != dto.PasswordConfirmation)
                throw new BusinessException("Passwords do not match.");

            if(!_passwordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                throw new BusinessException("Current password is incorrect.");

            user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);

            await _uow.CompleteAsync();
        }

        public async Task<bool> ToggleUserStatusAsync(int userId)
        {
            var user = await _uow.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            user.IsActive = !user.IsActive;
            await _uow.CompleteAsync();

            return user.IsActive;
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await _uow.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            user.IsDeleted = true;
            await _uow.CompleteAsync();
        }

        public async Task UpdateUserRoleAsync(int userId, string newRole)
        {
            var role = Enum.Parse<UserRole>(newRole, true);

            var user = await _uow.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            user.Role = role;
            await _uow.CompleteAsync();
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto requestDto)
        {
            var storedToken = await _uow.RefreshTokens.GetByTokenAsync(requestDto.RefreshToken);

            if (storedToken == null)
            {
                throw new UnauthorizedException("Refresh token does not exist.");
            }

            if (storedToken.IsRevoked || storedToken.IsUsed)
            {
                await _uow.RefreshTokens.RevokeUserTokensAsync(storedToken.UserId);
                await _uow.CompleteAsync();
                throw new UnauthorizedException("Token has been compromised! All sessions revoked.");
            }

            if (storedToken.ExpiryDate < DateTime.UtcNow)
            {
                throw new UnauthorizedException("Refresh token has expired. Please login again.");
            }

            var jti = _tokenService.GetJtiFromExpiredToken(requestDto.Token);
            if (storedToken.JwtId != jti)
            {
                throw new UnauthorizedException("Token mismatch.");
            }

            storedToken.IsUsed = true;
            await _uow.RefreshTokens.UpdateAsync(storedToken);
            await _uow.CompleteAsync();

            var user = storedToken.User;
            var tokenResponse = _tokenService.GenerateToken(user);
            var newRefreshTokenValue = _tokenService.GenerateRefreshToken();

            var newRefreshTokenEntity = new UserRefreshToken
            {
                Token = newRefreshTokenValue,
                JwtId = tokenResponse.JwtId,
                UserId = user.UserId,
                ExpiryDate = DateTime.UtcNow.AddDays(7)
            };

            await _uow.RefreshTokens.AddAsync(newRefreshTokenEntity);
            await _uow.CompleteAsync();

            var authResponse = _mapper.Map<AuthResponseDto>(user);

            authResponse.Token = tokenResponse.AccessToken;
            authResponse.ExpiresAt = tokenResponse.Expiration;
            authResponse.RefreshToken = newRefreshTokenValue;

            return authResponse;
        }

        public async Task RevokeTokenAsync(string token)
        {
            var storedToken = await _uow.RefreshTokens.GetByTokenAsync(token);

            if (storedToken == null)
            {
                throw new UnauthorizedException("Refresh token does not exist.");
            }

            storedToken.IsRevoked = true;
            await _uow.RefreshTokens.UpdateAsync(storedToken);
            await _uow.CompleteAsync();
        }
    }
}
