using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class SpecialtyRepository(AppDbContext context) : GenericRepository<Specialty>(context), ISpecialtyRepository
{
    
}