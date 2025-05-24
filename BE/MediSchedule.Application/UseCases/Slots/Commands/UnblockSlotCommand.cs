using MediatR;

namespace MediSchedule.Application.UseCases.Slots.Commands;

public record UnblockSlotCommand(Guid SlotId) : IRequest<Unit>;