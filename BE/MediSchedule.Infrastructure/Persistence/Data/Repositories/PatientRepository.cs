using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class PatientRepository(AppDbContext context) : GenericRepository<Patient>(context), IPatientRepository
{
    
}