using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Specialty : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    
    public IEnumerable<Doctor> Doctors { get; set; } = new List<Doctor>();
}