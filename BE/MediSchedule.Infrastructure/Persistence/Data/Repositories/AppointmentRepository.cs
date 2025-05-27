using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class AppointmentRepository(AppDbContext context) : GenericRepository<Appointment>(context), IAppointmentRepository
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<TimeSpan>> GetBookedTimesAsync(Guid doctorId, DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date)
            .Select(a => a.AppointmentTime)
            .ToListAsync();
    }
}