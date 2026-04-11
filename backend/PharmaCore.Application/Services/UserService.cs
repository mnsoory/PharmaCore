

using AutoMapper;
using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Core.Interfaces.Security;
using PharmaCore.Core.Interfaces.Services;
using System.Threading.Tasks;

namespace PharmaCore.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly IUserContextService _userContextService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper,
            ITokenService tokenService, IUserContextService userContextService, IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _tokenService = tokenService;
            _userContextService = userContextService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<UserResponseDto> RegisterUser(RegisterUserDto userDto)
        {
            if (await _userRepository.ExistsAsync(userDto.Username))
                throw new BusinessException($"Username '{userDto.Username}' is already taken.");

            if (await _userRepository.EmailExistsAsync(userDto.Email))
                throw new BusinessException($"Email '{userDto.Email}' is already registered.");

            if (userDto.Phone is not null && await _userRepository.PhoneExistsAsync(userDto.Phone))
                throw new BusinessException($"Phone number '{userDto.Phone}' is already in use.");

            User userEntity = _mapper.Map<User>(userDto);
            userEntity.PasswordHash = _passwordHasher.HashPassword(userDto.Password);

            await _userRepository.AddAsync(userEntity);
            return _mapper.Map<UserResponseDto>(userEntity);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await _userRepository.GetByIdentifierAsync(loginDto.Identifier);



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

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            authResponse.Token = tokenResponse.AccessToken;
            authResponse.ExpiresAt = tokenResponse.Expiration;
            authResponse.RefreshToken = refreshTokenValue;
            return authResponse;
        }

        public async Task<UserResponseDto> GetByIdAsync(int userId)
        {
            User? user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new NotFoundException($"User with ID: {userId} was not found.");

            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();

            var usersDto = _mapper.Map<IEnumerable<UserResponseDto>>(users);
            return usersDto;
        }

        public async Task<UserResponseDto> GetByUsernameAsync(string username)
        {
            User? user = await _userRepository.GetByUsernameAsync(username);

            if (user == null)
                throw new NotFoundException($"User with Username: {username} was not found.");

            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {
            var currentUserId = _userContextService.GetUserId();
            var currentUserRole = _userContextService.GetUserRole();

            if (currentUserRole != UserRole.Admin.ToString() && currentUserId != userId)
            {
                throw new UnauthorizedException("You do not have permission to modify another user's data.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            if (user.Email != updateUserDto.Email && await _userRepository.EmailExistsAsync(updateUserDto.Email))
            {
                throw new BusinessException("This email is already registered to another user.");
            }

            if (user.Phone != updateUserDto.Phone && await _userRepository.PhoneExistsAsync(updateUserDto.Phone))
            {
                throw new BusinessException("This phone number is already in use.");
            }

            _mapper.Map(updateUserDto, user);

            await _userRepository.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(ChangePasswordDto dto)
        {
            var currentUserId = _userContextService.GetUserId();

            var user = await _userRepository.GetByIdAsync(currentUserId);
            if (user == null) throw new NotFoundException("User not found.");

            if (dto.NewPassword == dto.CurrentPassword)
                throw new BusinessException("New password must be different from the current password.");

            if (dto.NewPassword != dto.PasswordConfirmation)
                throw new BusinessException("Passwords do not match.");

            if(!_passwordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                throw new BusinessException("Current password is incorrect.");

            user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);

            await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> ToggleUserStatusAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            user.IsActive = !user.IsActive;
            await _userRepository.UpdateAsync(user);
            return user.IsActive;
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            await _userRepository.DeleteAsync(user);
        }

        public async Task UpdateUserRoleAsync(int userId, string newRole)
        {
            var role = Enum.Parse<UserRole>(newRole, true);

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            user.Role = role;
            await _userRepository.UpdateAsync(user);
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto requestDto)
        {
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(requestDto.RefreshToken);

            if (storedToken == null)
            {
                throw new UnauthorizedException("Refresh token does not exist.");
            }

            if (storedToken.IsRevoked || storedToken.IsUsed)
            {
                await _refreshTokenRepository.RevokeUserTokensAsync(storedToken.UserId);
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
            await _refreshTokenRepository.UpdateAsync(storedToken);

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

            await _refreshTokenRepository.AddAsync(newRefreshTokenEntity);

            var authResponse = _mapper.Map<AuthResponseDto>(user);

            authResponse.Token = tokenResponse.AccessToken;
            authResponse.ExpiresAt = tokenResponse.Expiration;
            authResponse.RefreshToken = newRefreshTokenValue;

            return authResponse;
        }

        public async Task RevokeTokenAsync(string token)
        {
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(token);

            if (storedToken == null)
            {
                throw new UnauthorizedException("Refresh token does not exist.");
            }

            storedToken.IsRevoked = true;
            await _refreshTokenRepository.UpdateAsync(storedToken);
        }
    }
}
