using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Entities;

public class Hospital : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Description { get; set; } = null!;
    public Coordinates Coordinates { get; set; }
    public string CoverImage { get; set; } = null!;
    
    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}