using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Review : BaseEntity
{
    public Guid DoctorId { get; set; }
    [ForeignKey("DoctorId")]
    public Doctor Doctor { get; set; } = null!;
    
    [Range(1, 5)]
    public int Rating { get; set; }
    public string Comment { get; set; } = null!;
    public string PatientName { get; set; } = null!;
}