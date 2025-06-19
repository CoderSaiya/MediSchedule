namespace MediSchedule.Application.DTOs;

public record DatabaseStatsResponse(
    double PercentUsed,
    long ResponseTime
    );