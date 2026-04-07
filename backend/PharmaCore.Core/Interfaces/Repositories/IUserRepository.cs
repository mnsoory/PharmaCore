
using PharmaCore.Core.Entities;

namespace PharmaCore.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);

        Task<IEnumerable<User>> GetAllAsync();

        Task AddAsync(User user);

        Task UpdateAsync(User user);

        Task DeleteAsync(int id);

        Task<User?> GetByUsernameAsync(string username);

        Task<bool> ExistsAsync(string username);
    }
}
