namespace MediSchedule.Application.Interface;

public interface INotificationService
{
    Task PushNotificationAsync(string userId, object payload);
}