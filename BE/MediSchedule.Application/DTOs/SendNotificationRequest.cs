namespace MediSchedule.Application.DTOs;

public record SendNotificationRequest(
    string Message,
    string Type
    );