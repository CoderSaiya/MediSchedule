using MediSchedule.Application.Interface;
using MediSchedule.Domain.Entities;
using MediSchedule.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Services;

public class ChatService(IHubContext<ChatHub> hubContext) : IChatService
{
    public async Task SendMessageAsync(ChatMessage message)
    {
        var group = ChatHub.GetSessionGroupName(message.SessionId);
        var payload = new
        {
            message.Id,
            message.SessionId,
            SenderType = message.SenderType.ToString(),
            message.Content,
            message.CreatedAt
        };
        await hubContext.Clients.Group(group)
            .SendAsync("ReceiveMessage", payload);
    }

    public async Task SendSessionEventAsync(Guid sessionId, object payload)
    {
        var group = ChatHub.GetSessionGroupName(sessionId);
        await hubContext.Clients.Group(group)
            .SendAsync("SessionEvent", payload);
    }
}