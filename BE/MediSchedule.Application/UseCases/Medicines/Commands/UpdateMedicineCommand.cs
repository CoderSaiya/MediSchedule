using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Medicines.Commands;

public record UpdateMedicineCommand(
    Guid Id,
    string Name,
    string? GenericName,
    string? Strength,
    string? Manufacturer,
    string? Description
    ) : IRequest<Unit>;