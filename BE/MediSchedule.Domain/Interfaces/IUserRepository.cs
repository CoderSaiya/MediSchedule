using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}