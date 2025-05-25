using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class SlotRepository(AppDbContext context) : GenericRepository<Slot>(context), ISlotRepository
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<Slot>> GetAvailableAsync(SlotFilter filter)
    {
        var query = _context.Slots.AsQueryable();
        
        if (filter.DoctorId.HasValue)
        {
            query = query.Where(s => s.DoctorId == filter.DoctorId.Value);
        }
        
        if (filter.StartAfter.HasValue)
        {
            query = query.Where(s => s.StartTime >= filter.StartAfter.Value);
        }
        
        if (filter.EndBefore.HasValue)
        {
            query = query.Where(s => s.EndTime <= filter.EndBefore.Value);
        }
        
        query = filter.IsAvailable.HasValue 
            ? query.Where(s => s.IsAvailable == filter.IsAvailable.Value) 
            : query.Where(s => s.IsAvailable);
        
        return await query.ToListAsync();
    }
}