using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = null!;
    public string? Email { get; set; }
    public string Password { get; set; } = null!;
    public UserStatus Status { get; set; } = UserStatus.Active;
    
    public Profile? Profile { get; set; }
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}