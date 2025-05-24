using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class ProfileRepository(AppDbContext context) : GenericRepository<Profile>(context), IProfileRepository
{
    
}