using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class NotificationRepository(AppDbContext context) : GenericRepository<Notification>(context), INotificationRepository
{
    public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId)
        => await context.Notifications.Where(n => n.UserId == userId).ToListAsync();
}