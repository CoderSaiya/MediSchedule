using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Appointment : BaseEntity
{
    // public Guid PatientId { get; set; }
    // [ForeignKey("PatientId")]
    // public Patient Patient { get; set; } = null!;
    public Guid DoctorId { get; set; }
    [ForeignKey("DoctorId")]
    public Doctor Doctor { get; set; } = null!;
    public Guid SlotId { get; set; }
    [ForeignKey("SlotId")]
    public Slot Slot { get; set; } = null!;
    
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    
    public string Reason { get; set; } = null!;
    
}