namespace MediSchedule.Domain.Specifications;

public class AdminStatistics
{
    public int TotalSlotsToday { get; set; }
    
    public int TotalAppointmentsToday { get; set; }
    public double AppointmentsDeltaPercent { get; set; }
    
    public int PendingToday { get; set; }
    public double PendingDeltaPercent { get; set; }
    
    public int CompletedToday { get; set; }
    public double CompletedDeltaPercent { get; set; }
    
    public int NewPatientsToday { get; set; }
    public double NewPatientsDeltaPercent { get; set; }
}