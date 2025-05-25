using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class ProfileRepository(AppDbContext context) : GenericRepository<Profile>(context), IProfileRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Profile?> GetByUserIdAsync(Guid userId)
        => await _context.Profiles
            .Include(u => u.User)
            .Where(p => p.UserId == userId)
            .FirstOrDefaultAsync();
}