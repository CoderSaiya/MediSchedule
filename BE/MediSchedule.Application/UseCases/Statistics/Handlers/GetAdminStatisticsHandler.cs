using MediatR;
using MediSchedule.Application.UseCases.Statistics.Queries;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Handlers;

public class GetAdminStatisticsHandler(IStatisticRepository statisticRepository) : IRequestHandler<GetAdminStatisticsQuery, AdminStatistics>
{
    public async Task<AdminStatistics> Handle(GetAdminStatisticsQuery request, CancellationToken cancellationToken) =>
        await statisticRepository.GetAdminStatisticsAsync();
}