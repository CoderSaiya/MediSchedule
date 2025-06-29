namespace MediSchedule.Domain.Specifications;

public class AppointmentStats
{
    public IEnumerable<TrendPoint> Trends { get; init; } = Array.Empty<TrendPoint>();
    public IEnumerable<HourDistribution> Distributions { get; init; } = Array.Empty<HourDistribution>();

    public int TotalInPeriod { get; init; }
    public double CompletionRate { get; init; }
    public double AveragePerDay { get; init; }
    public double CancelRate { get; init; }

}