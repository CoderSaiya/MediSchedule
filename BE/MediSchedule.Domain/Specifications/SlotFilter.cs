namespace MediSchedule.Domain.Specifications;

public class SlotFilter
{
    public Guid? DoctorId { get; set; }
    public DateTime? StartAfter { get; set; }
    public DateTime? EndBefore { get; set; }
    public bool? IsAvailable { get; set; }
}