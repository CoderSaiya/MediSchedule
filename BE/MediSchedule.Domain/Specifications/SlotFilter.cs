namespace MediSchedule.Domain.Specifications;

public class SlotFilter
{
    public Guid? DoctorId { get; set; }
    public DayOfWeek? Day { get; set; }
    public TimeSpan? StartAfter { get; set; }
    public TimeSpan? EndBefore { get; set; }
    public bool? IsAvailable { get; set; }
}