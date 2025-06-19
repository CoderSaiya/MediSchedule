using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class UserRepository(AppDbContext context) : GenericRepository<User>(context), IUserRepository
{
    private readonly AppDbContext _context = context;
    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByUsernameAsync(string username) =>
        await _context.Users.Where(u => u.Username == username).FirstOrDefaultAsync();
}