using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class MedicineRepository(AppDbContext context) : GenericRepository<Medicine>(context), IMedicineRepository
{
    
}