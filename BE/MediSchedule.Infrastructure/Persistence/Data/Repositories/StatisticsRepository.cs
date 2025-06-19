using MediSchedule.Application.DTOs;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class StatisticsRepository(AppDbContext context) : IStatisticRepository
{
    public async Task<DoctorStatistics> GetDoctorStatisticsAsync(
        Guid doctorId, 
        TimeZoneInfo? tz = null, 
        CancellationToken cancellationToken = default
        )
    {
        tz ??= TimeZoneInfo.Local;
        var utcNow = DateTime.UtcNow;
        var today = TimeZoneInfo.ConvertTimeFromUtc(utcNow, tz).Date;
        var yesterday = today.AddDays(-1);
        
        var stats = await context.Appointments
                        .Where(a => a.DoctorId == doctorId &&
                                    (a.AppointmentDate == today ||
                                     a.AppointmentDate == yesterday))
                        .GroupBy(a => 1)
                        .Select(g => new
                        {
                            TotalToday      = g.Count(a => a.AppointmentDate == today),
                            TotalYesterday  = g.Count(a => a.AppointmentDate == yesterday),
                            PendingToday    = g.Count(a => a.AppointmentDate == today 
                                                           && a.Status == AppointmentStatus.Pending),
                            CompletedToday  = g.Count(a => a.AppointmentDate == today 
                                                           && a.Status == AppointmentStatus.Completed),
                            CompletedYesterday = g.Count(a => a.AppointmentDate == yesterday 
                                                              && a.Status == AppointmentStatus.Completed),
                        })
                        .FirstOrDefaultAsync(cancellationToken) 
                    ?? new { TotalToday=0, TotalYesterday=0, PendingToday=0, CompletedToday=0, CompletedYesterday=0 };

        // Tách query riêng cho avg rating (ít tốn kém hơn so với nhiều sub‐case)
        var avgRating = await context.Reviews
                            .Where(r => r.DoctorId == doctorId)
                            .Select(r => (double?)r.Rating)
                            .AverageAsync(cancellationToken) 
                        ?? 0.0;

        return new DoctorStatistics
        {
            TotalAppointmentsToday = stats.TotalToday,
            AppointmentsDelta = stats.TotalToday - stats.TotalYesterday,
            TotalPendingPatients = stats.PendingToday,
            CompletedAppointmentsToday = stats.CompletedToday,
            CompletedDelta = stats.CompletedToday - stats.CompletedYesterday,
            AverageRating = Math.Round(avgRating, 2)
        };
    }
}