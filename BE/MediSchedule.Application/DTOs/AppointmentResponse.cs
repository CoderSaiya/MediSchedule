namespace MediSchedule.Application.DTOs;

public record AppointmentResponse(
    Guid Id,
    Guid DoctorId,
    Guid SlotId,
    string FullName,
    string Phone,
    string Email,
    string AppointmentDate,
    string AppointmentTime,
    string FileUrl,
    string Reason,
    string Status,
    DoctorDto Doctor,
    SlotDto Slot
    );