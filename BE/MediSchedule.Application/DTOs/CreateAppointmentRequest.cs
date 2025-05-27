namespace MediSchedule.Application.DTOs;

public record CreateAppointmentRequest(
    Guid DoctorId,
    Guid SlotId,
    DateTime AppointmentDate,
    string AppointmentTime, // "08:30"
    string Reason
    );