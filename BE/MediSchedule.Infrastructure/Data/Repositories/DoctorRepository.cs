using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;

namespace MediSchedule.Infrastructure.Data.Repositories;

public class DoctorRepository(AppDbContext context) : GenericRepository<Doctor>(context), IDoctorRepository
{
    
}