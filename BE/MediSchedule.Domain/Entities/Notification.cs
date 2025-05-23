using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public NotificationType Type { get; set; }
    public string Content { get; set; } = null!;
}