using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Medicine : BaseEntity
{
    public string Name { get; set; } = null!;
     public string? GenericName { get; set; }
     public string? Strength { get; set; }
     public string? Manufacturer { get; set; }
     public string? Description { get; set; }
     
     public ICollection<PrescriptionMedication> PrescriptionMedications { get; set; } = new List<PrescriptionMedication>();
}