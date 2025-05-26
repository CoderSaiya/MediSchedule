using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class SpecialtyRepository(AppDbContext context) : GenericRepository<Specialty>(context), ISpecialtyRepository
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<Specialty>> ListAsync(SpecialtyFilter filter)
    {
        IQueryable<Specialty> q = _context.Specialties.Include(s => s.Doctors);

        if (!string.IsNullOrEmpty(filter.Name))
            q = q.Where(s => EF.Functions.Like(s.Name, $"%{filter.Name}%"));

        return await q.ToListAsync();
    }
}