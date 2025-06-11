using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;

namespace MediSchedule.Domain.Entities;

public class Specialty : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Icon { get; set; } = null!;
    public string Color { get; set; } = null!;
    public string BackgroundColor { get; set; } = null!;
    public string BorderColor { get; set; } = null!;
    public double Amount { get; set; }
    public string AverageTime { get; set; } = null!;
    public int PatientsSatisfied { get; set; }
    public string WaitTime { get; set; } = null!;
    public bool IsAvailable { get; set; } = true;
    public string FeaturesCsv { get; set; } = string.Empty;
    [NotMapped]
    public string[] Features
    {
        get => string.IsNullOrWhiteSpace(FeaturesCsv)
            ? []
            : FeaturesCsv.Split(',', StringSplitOptions.RemoveEmptyEntries);
        set => FeaturesCsv = string.Join(',', value);
    }
    
    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}