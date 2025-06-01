using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Prescription : BaseEntity
{
    public Guid AppointmentId { get; set; }
    [ForeignKey("AppointmentId")]
    public Appointment Appointment { get; set; } = null!;
    
    public string? Notes { get; set; }
    public string? FileUrl { get; set; }
    
    public ICollection<PrescriptionMedication> PrescriptionMedications { get; set; } = new List<PrescriptionMedication>();
}