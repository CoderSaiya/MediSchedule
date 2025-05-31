using MediatR;
using MediSchedule.Application.UseCases.Statistics.Queries;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Handlers;

public class GetDoctorStatisticsHandler(IStatisticRepository statisticRepository) : IRequestHandler<GetDoctorStatisticsQuery, DoctorStatistics>
{
    public async Task<DoctorStatistics> Handle(GetDoctorStatisticsQuery request, CancellationToken cancellationToken) =>
        await statisticRepository.GetDoctorStatisticsAsync(request.DoctorId, request.Tz, cancellationToken);
}