namespace MediSchedule.Domain.Specifications;

public class ProfileFilter
{
    public Guid? UserId { get; set; }
    public string? FullName { get; set; }
}