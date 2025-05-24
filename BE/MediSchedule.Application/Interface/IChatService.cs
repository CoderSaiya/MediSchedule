using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.Interface;

public interface IChatService
{
    Task SendMessageAsync(ChatMessage message);
    Task SendSessionEventAsync(Guid sessionId, object payload);
}