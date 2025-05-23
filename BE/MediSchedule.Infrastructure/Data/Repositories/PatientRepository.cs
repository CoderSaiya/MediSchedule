using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;

namespace MediSchedule.Infrastructure.Data.Repositories;

public class PatientRepository(AppDbContext context) : GenericRepository<Patient>(context), IPatientRepository
{
    
}