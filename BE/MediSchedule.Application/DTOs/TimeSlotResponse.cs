namespace MediSchedule.Application.DTOs;

public record TimeSlotResponse(
    Guid Id,
    string Time, 
    bool IsBooked
    );