namespace MediSchedule.Domain.Specifications;

public class AppointmentFilter
{
    public Guid? PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}