using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class SlotRepository(AppDbContext context) : GenericRepository<Slot>(context), ISlotRepository
{
    
}