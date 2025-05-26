using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Specialties.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Specialties.Handlers;

public class GetSpecialtiesHandler(ISpecialtyRepository specialtyRepository) : IRequestHandler<GetSpecialtiesQuery, IEnumerable<SpecialtyResponse>>
{
    public async Task<IEnumerable<SpecialtyResponse>> Handle(GetSpecialtiesQuery request,
        CancellationToken cancellationToken)
    {
        var specialties = await specialtyRepository.ListAsync(request.Filter);
        
        return specialties.Select(s => new SpecialtyResponse(
            Title: s.Name,
            Description: s.Description,
            Icon: s.Icon,
            Color: s.Color,
            BgColor: s.BackgroundColor,
            BorderColor: s.BorderColor,
            Doctors: s.Doctors.Count(),
            AvgTime: s.AverageTime,
            Rating: CalculateSpecialtyRating(s),
            Price: s.Amount,
            Features: s.Features,
            Available: s.IsAvailable,
            PatientsSatisfied: s.PatientsSatisfied,
            WaitTime: s.WaitTime,
            NextAvailable: GetNextAvailableSlot(s)
        ));
    }
    
    private float CalculateSpecialtyRating(Specialty specialty)
    {
        var allRatings = specialty.Doctors
            .SelectMany(d => d.Reviews.Select(r => r.Rating))
            .ToList();

        return allRatings.Count == 0 
            ? 0 
            : (float)Math.Round(allRatings.Average(), 1);
    }
    
    private string GetNextAvailableSlot(Specialty specialty)
    {
        var allSlots = specialty.Doctors
            .SelectMany(d => d.Slots)
            .Where(s => s.IsAvailable)
            .OrderBy(s => GetNextOccurrence(s.Day, s.StartTime))
            .FirstOrDefault();

        return allSlots == null 
            ? "Không có lịch trống" 
            : FormatNextAvailable(allSlots);
    }
    
    private static DateTime GetNextOccurrence(DayOfWeek day, TimeSpan startTime)
    {
        DateTime today = DateTime.Today;
        int daysUntilNext = ((int)day - (int)today.DayOfWeek + 7) % 7;
        DateTime nextDate = today.AddDays(daysUntilNext);
        DateTime combinedDateTime = nextDate.Add(startTime);
        
        return combinedDateTime < DateTime.Now 
            ? combinedDateTime.AddDays(7) 
            : combinedDateTime;
    }
    
    private static string FormatNextAvailable(Slot slot)
    {
        var nextOccurrence = GetNextOccurrence(slot.Day, slot.StartTime);
        return nextOccurrence.Date == DateTime.Today
            ? $"Hôm nay, {nextOccurrence:HH:mm}"
            : $"{nextOccurrence:dd/MM}, {nextOccurrence:HH:mm}";
    }
}