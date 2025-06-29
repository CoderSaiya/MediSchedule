namespace MediSchedule.Application.DTOs;

public record NotificationResponse(
    Guid Id,
    string Recipient,
    string NotificationType,
    string Content,
    string CreatedAt
    );