using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Slots.Queries;

public record GetTimeSlotQuery(
    Guid DoctorId,
    DateTime Date
    ) : IRequest<IEnumerable<TimeSlotResponse>>;