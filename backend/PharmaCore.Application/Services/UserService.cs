

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

        public async Task<int> RegisterUser(RegisterUserDto userDto)
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
            return userEntity.UserId;
        }
    }
}
