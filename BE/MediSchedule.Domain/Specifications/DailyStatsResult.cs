namespace MediSchedule.Domain.Specifications;

public class DailyStatsResult
{
    public int TotalToday { get; set; }
    public int TotalYesterday { get; set; }
    public double DeltaPercent { get; set; }
}