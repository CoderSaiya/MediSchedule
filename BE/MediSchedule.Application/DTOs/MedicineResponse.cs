namespace MediSchedule.Application.DTOs;

public record MedicineResponse(
    Guid Id,
    string Name,
    string? GenericName,
    string? Strength,
    string? Manufacturer,
    string? Description
    );