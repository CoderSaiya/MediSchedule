using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.Interface;

public interface IChatService
{
    Task SendSessionEventAsync(Guid sessionId, object payload);
    Task AddConnectionToGroupAsync(string connectionId, string groupName);
}