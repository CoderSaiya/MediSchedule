using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.DTOs;

public record CreatePrescriptionRequest(
    Guid AppointmentId,
    string? Notes,
    IFormFile File,
    List<CreatePrescriptionMedicationDto> Items
    );