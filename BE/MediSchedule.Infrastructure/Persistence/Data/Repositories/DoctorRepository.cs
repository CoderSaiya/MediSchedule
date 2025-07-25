﻿using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class DoctorRepository(AppDbContext context) : GenericRepository<Doctor>(context), IDoctorRepository
{
    private readonly AppDbContext _context = context;

    public override async Task<IEnumerable<Doctor>> ListAsync()
    {
        return await _context.Doctors
            .Include(d => d.Slots)
            .Include(d => d.Profile)
            .Include(d => d.Specialty)
            .Include(d => d.Reviews)
            .Include(d => d.Hospital)
            .ToListAsync();
    }

    public override async Task<Doctor?> GetByIdAsync(Guid id)
    {
        return await _context.Doctors
            .Include(d => d.Profile)
            .Include(d => d.Specialty)
            .Include(d => d.Slots)
            .Where(d => d.Id == id)
            .FirstOrDefaultAsync();
    }
    
    public async Task<bool> IsLicenseUniqueAsync(string licenseNumber, Guid? excludeId = null)
    {
        return !await _context.Doctors
            .AnyAsync(d => d.LicenseNumber == licenseNumber && 
                           (excludeId == null || d.Id != excludeId));
    }
}