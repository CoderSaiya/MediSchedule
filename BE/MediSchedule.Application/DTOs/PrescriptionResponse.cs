namespace MediSchedule.Application.DTOs;

public record PrescriptionResponse(
    Guid Id,
    Guid AppointmentId,
    string? Notes,
    string? FileUrl,
    List<PrescriptionMedicationDto> Items
    );