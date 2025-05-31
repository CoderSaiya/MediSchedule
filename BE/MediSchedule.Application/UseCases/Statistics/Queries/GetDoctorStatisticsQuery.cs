using MediatR;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Queries;

public record GetDoctorStatisticsQuery(
    Guid DoctorId, 
    TimeZoneInfo? Tz = null
    ) : IRequest<DoctorStatistics>;