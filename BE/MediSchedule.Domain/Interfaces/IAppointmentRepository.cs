using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetByDoctorIdAsync(Guid doctorId);
    Task<IEnumerable<TimeSpan>> GetBookedTimesAsync(Guid doctorId, DateTime date);
    Task<IEnumerable<Appointment>> GetByDateAsync(DateTime date);
}