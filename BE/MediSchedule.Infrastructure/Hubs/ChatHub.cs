using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var sessionId = httpContext?.Request.Query["sessionId"].ToString();
        if (Guid.TryParse(sessionId, out var sid))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetSessionGroupName(sid));
        }
        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        var sessionId = httpContext?.Request.Query["sessionId"].ToString();
        if (Guid.TryParse(sessionId, out var sid))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetSessionGroupName(sid));
        }
        await base.OnDisconnectedAsync(exception);
    }
    
    public static string GetSessionGroupName(Guid sessionId) => $"chat-session-{sessionId}";
}