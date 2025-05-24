using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(userId));
        }
        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(System.Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(userId));
        }
        await base.OnDisconnectedAsync(exception);
    }
    
    public static string GetGroupName(string userId) => $"user-{userId}";
}