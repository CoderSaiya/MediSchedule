using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Specifications;

public class UserFiler
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public UserStatus? Status { get; set; }
}