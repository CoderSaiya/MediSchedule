using MediatR;
using MediSchedule.Application.UseCases.Slots.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Slots.Handlers;

public class BlockSlotHandler(
    ISlotRepository slotRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<BlockSlotCommand, Unit>
{
    public async Task<Unit> Handle(BlockSlotCommand request, CancellationToken cancellationToken)
    {
        var slot = await slotRepository.GetByIdAsync(request.SlotId);
        if (slot is  null || !slot.IsAvailable)
            throw new Exception("Slot not found or already blocked.");
        
        slot.IsAvailable = false;
        await slotRepository.UpdateAsync(slot);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}