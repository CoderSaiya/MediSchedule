using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Specifications;

public class PatientFilter
{
    public string? Username { get; set; }
    public UserStatus? Status { get; set; }
}