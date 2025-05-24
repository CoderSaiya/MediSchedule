using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class AppointmentRepository(AppDbContext context) : GenericRepository<Appointment>(context), IAppointmentRepository
{
    
}