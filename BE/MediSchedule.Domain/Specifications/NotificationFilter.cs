using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Specifications;

public class NotificationFilter
{
    public Guid? UserId { get; set; }
    public NotificationType? Type { get; set; }
    public bool? UnreadOnly { get; set; }
}