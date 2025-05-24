using MediatR;

namespace MediSchedule.Application.UseCases.Slots.Commands;

public record BlockSlotCommand(Guid SlotId) : IRequest<Unit>;