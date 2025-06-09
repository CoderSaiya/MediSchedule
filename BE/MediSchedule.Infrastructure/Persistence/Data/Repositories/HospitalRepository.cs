using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class HospitalRepository(AppDbContext context) : GenericRepository<Hospital>(context), IHospitalRepository
{
    
}