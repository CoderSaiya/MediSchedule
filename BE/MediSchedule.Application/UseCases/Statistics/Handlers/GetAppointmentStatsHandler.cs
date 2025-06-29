using MediatR;
using MediSchedule.Application.UseCases.Statistics.Queries;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Handlers;

public class GetAppointmentStatsHandler(IStatisticRepository statisticRepository) : IRequestHandler<GetAppointmentStatsQuery, AppointmentStats>
{
    public async Task<AppointmentStats> Handle(GetAppointmentStatsQuery request, CancellationToken cancellationToken) =>
        await statisticRepository.GetAppointmentStatisticsAsync(request.Period, request.Tz);
}