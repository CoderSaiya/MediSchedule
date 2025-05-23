using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Slot : BaseEntity
{
    public Guid DoctorId { get; set; }
    [ForeignKey("DoctorId")]
    public Doctor Doctor { get; set; } = null!;
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
}