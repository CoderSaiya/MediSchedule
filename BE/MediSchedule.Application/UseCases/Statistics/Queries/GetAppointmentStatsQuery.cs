using MediatR;
using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Application.UseCases.Statistics.Queries;

public record GetAppointmentStatsQuery(
    StatsPeriod Period,
    TimeZoneInfo? Tz = null
    ) : IRequest<AppointmentStats>;