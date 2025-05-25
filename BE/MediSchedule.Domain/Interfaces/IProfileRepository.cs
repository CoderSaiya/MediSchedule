using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IProfileRepository : IRepository<Profile>
{
    Task<Profile?> GetByUserIdAsync(Guid userId);
}