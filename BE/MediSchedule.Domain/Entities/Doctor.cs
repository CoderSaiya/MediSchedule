using System.ComponentModel.DataAnnotations.Schema;

namespace MediSchedule.Domain.Entities;

public class Doctor : User
{
    public Guid SpecialtyId { get; set; }
    [ForeignKey("SpecialtyId")]
    public Specialty Specialty { get; set; } = null!;

    public string LicenseNumber { get; set; } = null!;
    public string Biography { get; set; } = null!;
    
    public ICollection<Slot> Slots { get; set; } = new List<Slot>();
}