using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

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

    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public string? FileUrl { get; set; }
    
    public string Reason { get; set; } = null!;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
}