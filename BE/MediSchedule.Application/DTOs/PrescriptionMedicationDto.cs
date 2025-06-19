namespace MediSchedule.Application.DTOs;

public record PrescriptionMedicationDto(
    Guid Id,
    Guid MedicineId,
    string Dosage,
    int Quantity,
    string? Unit,
    string Instructions,
    string? ItemNotes,
    MedicineDto Medicine
    );