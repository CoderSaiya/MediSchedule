using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class HospitalRepository(AppDbContext context) : GenericRepository<Hospital>(context), IHospitalRepository
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<Doctor>> GetByHospitalAsync(Guid hospitalId)
    {
        return await _context.Doctors
            .Where(d => d.HospitalId == hospitalId)
            .Include(d => d.Specialty)
            .ToListAsync();
    }
}