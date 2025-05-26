namespace MediSchedule.Application.DTOs;

public record CreateSpecialty(
    string Name, 
    string Description,
    string Icon,
    string Color,
    string BackgroundColor,
    string BorderColor,
    double Amount,
    string AverageTime,
    int PatientsSatisfied,
    string WaitTime,
    bool IsAvailable,
    string Features
    );