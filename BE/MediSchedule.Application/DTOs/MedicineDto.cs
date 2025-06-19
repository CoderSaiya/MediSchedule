namespace MediSchedule.Application.DTOs;

public record MedicineDto(
    Guid Id,
    string Name,
    string? GenericName,
    string? Strength,
    string? Manufacturer,
    string? Description
    );