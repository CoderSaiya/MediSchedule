namespace MediSchedule.Application.DTOs;

public record TimeSlotResponse(
    string Time, 
    bool IsBooked
    );