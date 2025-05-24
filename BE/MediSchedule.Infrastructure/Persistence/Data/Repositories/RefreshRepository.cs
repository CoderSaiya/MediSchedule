using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class RefreshRepository(AppDbContext context) : IRefreshRepository
{
    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await context.RefreshTokens
            .Include(t => t.User)
            .Where(t => t.Token == token)
            .FirstOrDefaultAsync();
    }

    public async Task<RefreshToken?> GetValidTokenByUserAsync(Guid userId)
    {
        return await context.RefreshTokens
            .Where(t => t.UserId == userId &&
                        t.IsRevoked == false &&
                        t.ExpiryDate > DateTime.UtcNow)
            .OrderByDescending(t => t.ExpiryDate)
            .FirstOrDefaultAsync();
    }
    
    public async Task<bool> HasValidTokenAsync(Guid userId)
    {
        return await context.RefreshTokens
            .AnyAsync(t => t.UserId == userId && 
                           t.IsRevoked == false && 
                           t.ExpiryDate > DateTime.UtcNow);
    }

    public async Task AddAsync(RefreshToken refreshToken)
    {
        await context.RefreshTokens.AddAsync(refreshToken);
    }

    public async Task UpdateAsync(RefreshToken refreshToken)
    {
        var token = await context.RefreshTokens.FindAsync(refreshToken.Id);
        if (token == null)
        {
            throw new KeyNotFoundException();
        }
        context.Entry(token).CurrentValues.SetValues(refreshToken);
    }
}