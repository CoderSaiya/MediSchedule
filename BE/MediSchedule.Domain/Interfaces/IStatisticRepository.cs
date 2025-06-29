using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Interfaces;

public interface IStatisticRepository
{
    Task<DoctorStatistics> GetDoctorStatisticsAsync(Guid doctorId, TimeZoneInfo? tz = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<SpecialtyStats>> GetSpecialtyStatisticsAsync();
    Task<AdminStatistics> GetAdminStatisticsAsync(TimeZoneInfo? tz = null);
    Task<AppointmentStats> GetAppointmentStatisticsAsync(StatsPeriod period, TimeZoneInfo? tz = null);
}