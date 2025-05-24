using MediatR;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Slots.Queries;

public record GetAvailableSlotsQuery(SlotFilter Filter) : IRequest<IEnumerable<Slot>>;