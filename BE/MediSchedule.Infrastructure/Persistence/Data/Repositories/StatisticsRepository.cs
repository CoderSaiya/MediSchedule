using System.Linq.Expressions;
using MediSchedule.Application.DTOs;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;
using MediSchedule.Infrastructure.Persistence.Data.Helpers;
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
                            TotalToday = g.Count(a => a.AppointmentDate == today),
                            TotalYesterday = g.Count(a => a.AppointmentDate == yesterday),
                            PendingToday = g.Count(a => a.AppointmentDate == today 
                                                           && a.Status == AppointmentStatus.Pending),
                            CompletedToday = g.Count(a => a.AppointmentDate == today 
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

    public async Task<IEnumerable<SpecialtyStats>> GetSpecialtyStatisticsAsync()
    {
        var raw = await context.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.Specialty)
            .GroupBy(a => a.Doctor.Specialty.Name)
            .Select(g => new SpecialtyStats
            {
                Name = g.Key,
                Patients = g.Count(),
                Percent = 0
            })
            .ToListAsync();
        
        var totalPatients = raw.Sum(a => a.Patients);
        foreach (var s in raw)
            s.Percent = totalPatients == 0 ? 0 : Math.Round(s.Patients * 100.0 / totalPatients, 2);
        
        return raw;
    }

    public async Task<AdminStatistics> GetAdminStatisticsAsync(TimeZoneInfo? tz = null)
    { 
        tz ??= TimeZoneInfo.Local;
        var utcNow = DateTime.UtcNow;
        var today = TimeZoneInfo.ConvertTimeFromUtc(utcNow, tz).Date;
        var yesterday = today.AddDays(-1);
        var todayDow = today.DayOfWeek;
        
        var totalSlotsToday = await context.Slots
            .Where(s => s.Day == todayDow)
            .CountAsync();
        
        async Task<DailyStatsResult> CountApptsAsync(Expression<Func<Appointment, bool>> filter)
        {
            return await StatsHelper.ComputeCountAsync(
                source: context.Appointments,
                dateSelector: a => a.AppointmentDate,
                filter: filter,
                today: today,
                yesterday: yesterday
            );
        }
        var totalAppts = await CountApptsAsync(a => true);
        
        var totalPending = await CountApptsAsync(a => a.Status == AppointmentStatus.Pending);
        
        var totalCompleted = await CountApptsAsync(a => a.Status == AppointmentStatus.Completed);
        
        var firstDatesByEmail = await context.Appointments
            .GroupBy(a => a.Email)
            .Select(g => g.Min(a => a.AppointmentDate))
            .ToListAsync();

        int newT = firstDatesByEmail.Count(d => d == today);
        int newY = firstDatesByEmail.Count(d => d == yesterday);
        double newDelta = newY == 0
            ? (newT == 0 ? 0 : 100)
            : Math.Round((newT - newY) * 100.0 / newY, 0);
        
        return new AdminStatistics
        {
            TotalSlotsToday = totalSlotsToday,
            TotalAppointmentsToday = totalAppts.TotalToday,
            AppointmentsDeltaPercent = totalAppts.DeltaPercent,
            PendingToday = totalPending.TotalToday,
            PendingDeltaPercent = totalPending.DeltaPercent,
            CompletedToday = totalCompleted.TotalToday,
            CompletedDeltaPercent = totalCompleted.DeltaPercent,
            NewPatientsToday = newT,
            NewPatientsDeltaPercent = newDelta,
        };
    }

    public async Task<AppointmentStats> GetAppointmentStatisticsAsync(StatsPeriod period, TimeZoneInfo? tz = null)
    {
        tz ??= TimeZoneInfo.Local;
        var utcNow = DateTime.UtcNow;
        var today = TimeZoneInfo.ConvertTimeFromUtc(utcNow, tz).Date;
        var start = period switch
        {
            StatsPeriod.Week => today.AddDays(-(int)today.DayOfWeek + 1),
            StatsPeriod.Month => new DateTime(today.Year, today.Month, 1),
            StatsPeriod.Year => new DateTime(today.Year, 1, 1),
            _ => today
        };
        var end = today;
        
        var appts = await context.Appointments
            .Where(a => a.CreatedAt.Date >= start.Date && a.CreatedAt.Date <= end.Date)
            .ToListAsync();
        
        IEnumerable<TrendPoint> trend = period switch
        {
            StatsPeriod.Week => Enumerable.Range(1,7)
                                 .Select(d => {
                                   var date = start.AddDays(d-1);
                                   var cnt  = appts.Count(a => a.CreatedAt.Date == date.Date);
                                   var label = GetDayLabel(date.DayOfWeek);
                                   return new TrendPoint(label, cnt);
                                 }),
            StatsPeriod.Month => Enumerable.Range(1, DateTime.DaysInMonth(today.Year, today.Month))
                                 .Select(d => {
                                   var date = new DateTime(today.Year, today.Month, d);
                                   var cnt  = appts.Count(a => a.CreatedAt.Date == date.Date);
                                   return new TrendPoint(d.ToString(), cnt);
                                 }),
            StatsPeriod.Year => Enumerable.Range(1,12)
                                 .Select(m => {
                                   var cnt = appts.Count(a => a.CreatedAt.Month == m);
                                   return new TrendPoint(new DateTime(today.Year, m, 1).ToString("MMM"), cnt);
                                 }),
            _ => Array.Empty<TrendPoint>()
        };
        
        var dist = appts
            .Where(a => a.CreatedAt.Date == today.Date)
            .GroupBy(a => a.AppointmentTime.Hours)
            .Select(g => new HourDistribution(g.Key, g.Count()))
            .OrderBy(x => x.Hour)
            .ToList();
        
        int total = appts.Count;
        int compl = appts.Count(a => a.Status == AppointmentStatus.Completed);
        int cancelled = appts.Count(a => a.Status == AppointmentStatus.Cancelled);
        int daysCount = (end - start).Days + 1;

        double completionRate = total == 0 ? 0 : Math.Round(compl * 100.0 / total, 2);
        double cancelRate = total == 0 ? 0 : Math.Round(cancelled * 100.0 / total, 2);
        double avgPerDay = daysCount == 0 ? 0 : Math.Round(total * 1.0 / daysCount, 2);

        return new AppointmentStats
        {
            Trends = trend,
            Distributions = dist,
            TotalInPeriod = total,
            CompletionRate = completionRate,
            AveragePerDay = avgPerDay,
            CancelRate = cancelRate
        };
    }
    private static string GetDayLabel(DayOfWeek dayOfWeek)
    {
        return dayOfWeek switch
        {
            DayOfWeek.Monday => "T2",
            DayOfWeek.Tuesday => "T3",
            DayOfWeek.Wednesday => "T4",
            DayOfWeek.Thursday => "T5",
            DayOfWeek.Friday => "T6",
            DayOfWeek.Saturday => "T7",
            DayOfWeek.Sunday => "CN",
            _ => dayOfWeek.ToString() // Fallback
        };
    }
}