using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private static readonly ConcurrentDictionary<Guid, string> OnlineDoctors = new();
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext != null)
        {
            Console.WriteLine($"[NotificationHub] OnConnectedAsync called. QueryString = {httpContext.Request.QueryString}");
            
            if (httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
                Guid.TryParse(docIdString, out var docId))
            {
                OnlineDoctors[docId] = Context.ConnectionId;
                await base.OnConnectedAsync();
                return;
            }
            
            var sessionIdStr = httpContext.Request.Query["sessionId"].ToString();
            if (Guid.TryParse(sessionIdStr, out var sessionId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(sessionId));
            }
        }

        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        Console.WriteLine($"[NotificationHub] OnDisconnectedAsync called. Exception: {exception}");
        
        if (httpContext != null &&
            httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
            Guid.TryParse(docIdString, out var docId))
        {
            OnlineDoctors.TryRemove(docId, out _);
            await base.OnDisconnectedAsync(exception);
            return;
        }
        
        var sessionIdStr = httpContext.Request.Query["sessionId"].ToString();
        if (Guid.TryParse(sessionIdStr, out var sessionId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(sessionId));
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    [HubMethodName("SendNotificationAsync")]
    public async Task SendNotificationAsync(List<Guid> sessionIds, string content)
    {
        foreach (var sessionId in sessionIds)
        {
            var groupName = GetGroupName(sessionId);
            await Clients.Group(groupName).SendAsync("ReceiveNotification", new {
                Content = content,
                FromConnectionId = Context.ConnectionId,
                Timestamp = DateTime.UtcNow
            });
        }
    }
    
    public static string GetGroupName(Guid userId) => $"user-{userId}";
}