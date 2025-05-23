using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;

namespace MediSchedule.Infrastructure.Data.Repositories;

public class SlotRepository(AppDbContext context) : GenericRepository<Slot>(context), ISlotRepository
{
    
}