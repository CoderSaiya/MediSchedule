namespace MediSchedule.Application.DTOs;

public record CreateAppointmentRequest(
    Guid DoctorId,
    Guid PatientId,
    Guid SlotId,
    string Reason
    );