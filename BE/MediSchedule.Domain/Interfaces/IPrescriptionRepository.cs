using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IPrescriptionRepository : IRepository<Prescription>
{
    Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId);
}