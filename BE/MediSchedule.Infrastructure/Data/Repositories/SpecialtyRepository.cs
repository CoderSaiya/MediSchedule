using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;

namespace MediSchedule.Infrastructure.Data.Repositories;

public class SpecialtyRepository(AppDbContext context) : GenericRepository<Specialty>(context), ISpecialtyRepository
{
    
}