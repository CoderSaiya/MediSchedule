using MediSchedule.Application.Interface;
using MediSchedule.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Services;

public class NotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
{
    public async Task PushNotificationAsync(string userId, object payload)
    {
        var groupName = NotificationHub.GetGroupName(userId);
        await hubContext.Clients.Group(groupName)
            .SendAsync("ReceiveNotification", payload);
    }
}