namespace MediSchedule.Application.DTOs;

public record CreateMedicineRequest(
    string Name,
    string? GenericName,
    string? Strength,
    string? Manufacturer,
    string? Description
    );