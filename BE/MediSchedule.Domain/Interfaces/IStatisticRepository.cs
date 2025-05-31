using MediSchedule.Domain.Specifications;

namespace MediSchedule.Domain.Interfaces;

public interface IStatisticRepository
{
    Task<DoctorStatistics> GetDoctorStatisticsAsync(Guid doctorId, TimeZoneInfo? tz = null, CancellationToken cancellationToken = default);
}