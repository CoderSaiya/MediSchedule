using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<IEnumerable<TimeSpan>> GetBookedTimesAsync(Guid doctorId, DateTime date);
}