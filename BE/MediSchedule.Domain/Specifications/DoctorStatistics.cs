namespace MediSchedule.Domain.Specifications;

public class DoctorStatistics
{
    public int TotalAppointmentsToday { get; set; }
    public int AppointmentsDelta { get; set; }               
    public int TotalPendingPatients { get; set; }            
    public int CompletedAppointmentsToday { get; set; }
    public int CompletedDelta { get; set; }                  
    public double AverageRating { get; set; }
}