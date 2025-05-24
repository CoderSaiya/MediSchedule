using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class NotificationRepository(AppDbContext context) : GenericRepository<Notification>(context), INotificationRepository
{
    
}