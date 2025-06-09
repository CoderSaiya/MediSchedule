using System.ComponentModel.DataAnnotations.Schema;

namespace MediSchedule.Domain.Entities;

public class Doctor : User
{
    public Guid SpecialtyId { get; set; }
    [ForeignKey("SpecialtyId")]
    public Specialty Specialty { get; set; } = null!;
    public Guid? HospitalId { get; set; }
    public Hospital? Hospital { get; set; }

    public string LicenseNumber { get; set; } = null!;
    public string Biography { get; set; } = null!;
    
    public ICollection<Slot> Slots { get; set; } = new List<Slot>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}