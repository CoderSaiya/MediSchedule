using MediatR;
using MediSchedule.Application.UseCases.Slots.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Slots.Handlers;

public class GetAvailableSlotsHandler(ISlotRepository slotRepository) : IRequestHandler<GetAvailableSlotsQuery, IEnumerable<Slot>>
{
    public async Task<IEnumerable<Slot>> Handle(GetAvailableSlotsQuery request, CancellationToken cancellationToken)
        => await slotRepository.GetAvailableAsync(request.Filter);
}