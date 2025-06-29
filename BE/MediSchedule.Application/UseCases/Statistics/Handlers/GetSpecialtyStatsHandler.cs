using MediatR;
using MediSchedule.Application.UseCases.Statistics.Queries;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Handlers;

public class GetSpecialtyStatsHandler(IStatisticRepository statisticRepository) : IRequestHandler<GetSpecialtyStatsQuery, IEnumerable<SpecialtyStats>>
{
    public async Task<IEnumerable<SpecialtyStats>> Handle(GetSpecialtyStatsQuery request, CancellationToken cancellationToken) =>
        await statisticRepository.GetSpecialtyStatisticsAsync();
}