namespace MediSchedule.Application.DTOs;

public record SendNotificationRequest(
    List<Guid> DoctorIds,
    string Message
    );