using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class PrescriptionRepository(AppDbContext context) : GenericRepository<Prescription>(context), IPrescriptionRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId)
    {
        return await _context.Set<Prescription>()
            .Include(p => p.PrescriptionMedications)
            .ThenInclude(pm => pm.Medicine)
            .FirstOrDefaultAsync(p => p.AppointmentId == appointmentId);
    }
}