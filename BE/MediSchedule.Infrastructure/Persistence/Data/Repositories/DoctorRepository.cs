using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class DoctorRepository(AppDbContext context) : GenericRepository<Doctor>(context), IDoctorRepository
{
    private readonly AppDbContext _context = context;

    public override async Task<IEnumerable<Doctor>> ListAsync()
    {
        return await _context.Doctors
            .Include(d => d.Slots)
            .Include(d => d.Profile)
            .Include(d => d.Specialty)
            .Include(d => d.Reviews)
            .ToListAsync();
    }

    public override async Task<Doctor?> GetByIdAsync(Guid id)
    {
        return await _context.Doctors
            .Include(d => d.Profile)
            .Include(d => d.Specialty)
            .Where(d => d.Id == id)
            .FirstOrDefaultAsync();
    }
}