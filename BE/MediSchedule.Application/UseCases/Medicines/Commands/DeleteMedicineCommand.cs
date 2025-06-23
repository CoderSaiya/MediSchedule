using MediatR;

namespace MediSchedule.Application.UseCases.Medicines.Commands;

public record DeleteMedicineCommand(Guid MedicineId) : IRequest<Unit>;