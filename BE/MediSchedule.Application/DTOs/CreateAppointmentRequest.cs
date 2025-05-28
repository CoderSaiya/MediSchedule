namespace MediSchedule.Application.DTOs;

public record CreateAppointmentRequest(
    Guid DoctorId,
    Guid SlotId,
    string PatientName,
    string PatientPhone,
    string PatientEmail,
    string AppointmentDate,
    string AppointmentTime, // "08:30"
    string Reason
    );