using System.Linq.Expressions;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class SlotRepository(AppDbContext context) : GenericRepository<Slot>(context), ISlotRepository
{
    private readonly AppDbContext _context = context;
    
    public override async Task<bool> ExistsAsync(Expression<Func<Slot, bool>> predicate)
    {
        return await _context.Slots
            .Include(s => s.Doctor)
            .AnyAsync(predicate);
    }

    public async Task<IEnumerable<Slot>> GetAvailableAsync(SlotFilter filter)
    {
        var query = _context.Slots.AsQueryable();
        
        if (filter.DoctorId.HasValue)
        {
            query = query.Where(s => s.DoctorId == filter.DoctorId.Value);
        }

        if (filter.Day.HasValue)
        {
            query = query.Where(s => s.Day == filter.Day.Value);
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

    public async Task<IEnumerable<Slot>> GetSlotsByDoctorAsync(Guid doctorId, DayOfWeek day)
    {
        return await _context.Slots
            .Where(s => s.DoctorId == doctorId && s.Day == day)
            .AsNoTracking()
            .ToListAsync();
    }
}