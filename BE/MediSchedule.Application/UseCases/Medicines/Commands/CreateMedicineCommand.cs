using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Medicines.Commands;

public record CreateMedicineCommand(Medicine Medicine) : IRequest<Unit>;