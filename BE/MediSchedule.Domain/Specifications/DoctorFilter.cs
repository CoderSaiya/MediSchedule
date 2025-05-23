using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Specifications;

public class DoctorFilter
{
    public Guid? SpecialtyId { get; set; }
    public UserStatus? Status { get; set; }
}