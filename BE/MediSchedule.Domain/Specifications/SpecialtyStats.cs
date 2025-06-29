namespace MediSchedule.Domain.Specifications;

public class SpecialtyStats
{
    public string Name { get; set; } = null!;
    public int Patients { get; set; }
    public double Percent { get; set; }
}