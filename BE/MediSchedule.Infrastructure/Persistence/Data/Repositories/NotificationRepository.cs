using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class NotificationRepository(AppDbContext context) : GenericRepository<Notification>(context), INotificationRepository
{
    public override async Task<IEnumerable<Notification>> ListAsync()
    {
        return await context.Notifications
            .Include(n => n.User)
            .ThenInclude(u => u.Profile)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId)
        => await context.Notifications.Where(n => n.UserId == userId).ToListAsync();
}