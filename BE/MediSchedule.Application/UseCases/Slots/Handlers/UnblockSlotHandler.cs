using MediatR;
using MediSchedule.Application.UseCases.Slots.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Slots.Handlers;

public class UnblockSlotHandler(
    ISlotRepository slotRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<UnblockSlotCommand, Unit>
{
    public async Task<Unit> Handle(UnblockSlotCommand request, CancellationToken cancellationToken)
    {
        var slot = await slotRepository.GetByIdAsync(request.SlotId);
        if (slot is null || slot.IsAvailable)
            throw new Exception("Slot not found or already unblocked.");
        
        slot.IsAvailable = true;
        await slotRepository.UpdateAsync(slot);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}