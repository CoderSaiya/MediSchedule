namespace MediSchedule.Application.DTOs;

public record CreatePrescriptionMedicationDto(
    Guid MedicineId,
    string Dosage,
    int Quantity,
    string? Unit,
    string Instructions,
    string? ItemNotes = null
    );