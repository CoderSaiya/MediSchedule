namespace MediSchedule.Application.DTOs;

public record SlotDto(
    DayOfWeek Day,
    TimeSpan StartTime,
    TimeSpan EndTime
);