﻿using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class AppointmentRepository(AppDbContext context) : GenericRepository<Appointment>(context), IAppointmentRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Appointment?> GetByIdAsync(Guid id)
    {
        return await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Profile)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(Guid doctorId)
    {
        return await _context.Appointments
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Profile)
            .Include(a => a.Doctor)
            .ThenInclude(d => d.Specialty)
            .Include(d => d.Slot)
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TimeSpan>> GetBookedTimesAsync(Guid doctorId, DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date)
            .Select(a => a.AppointmentTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetByDateAsync(DateTime date)
    {
        return await _context.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.Profile)
            .Include(a => a.Doctor).ThenInclude(d => d.Specialty)
            .Where(a => a.CreatedAt.Date == date.Date)
            .ToListAsync();
    }
}