namespace MediSchedule.Application.Interface;

public interface INotificationService
{
    Task PushNotificationAsync(Guid userId, object payload);
}