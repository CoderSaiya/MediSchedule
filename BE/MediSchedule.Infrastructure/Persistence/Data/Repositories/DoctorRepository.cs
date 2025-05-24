using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class DoctorRepository(AppDbContext context) : GenericRepository<Doctor>(context), IDoctorRepository
{
    
}