using MediSchedule.Application.Interface;
using MediSchedule.Domain.Entities;
using MediSchedule.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Services;

public class ChatService(IHubContext<ChatHub> hubContext) : IChatService
{
    public async Task SendSessionEventAsync(Guid sessionId, object payload)
    {
        var groupName = ChatHub.GetSessionGroupName(sessionId);
        await hubContext.Clients.Group(groupName).SendAsync("SessionEvent", payload);
    }

    public async Task AddConnectionToGroupAsync(string connectionId, string groupName)
    {
        await hubContext.Groups.AddToGroupAsync(connectionId, groupName);
    }
}