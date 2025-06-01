using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class PrescriptionMedication : BaseEntity
{
    public Guid PrescriptionId { get; set; }
    [ForeignKey("PrescriptionId")]
    public Prescription Prescription { get; set; } = null!;
    public Guid MedicineId { get; set; }
    [ForeignKey("MedicineId")]
    public Medicine Medicine { get; set; } = null!;
    
    public string Dosage { get; set; } = null!;
    public int Quantity { get; set; }
    public string? Unit { get; set; }
    public string Instructions { get; set; } = null!;
    public string? ItemNotes { get; set; }
}