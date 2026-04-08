

using AutoMapper;
using PharmaCore.Core.DTOs.User;
using PharmaCore.Core.Entities;
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

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IMapper mapper)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
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


        public Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto)
        {
            throw new NotImplementedException();
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
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            if (user.Email != updateUserDto.Email && await _userRepository.EmailExistsAsync(updateUserDto.Email))
            {
                throw new BusinessException("This email is already registered to another user.");
            }

            _mapper.Map(updateUserDto, user);

            await _userRepository.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
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
    }
}
