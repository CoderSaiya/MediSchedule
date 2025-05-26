namespace MediSchedule.Application.DTOs;

public record SpecialtyResponse(
    string Title,
    string Description,
    string Icon,
    string Color,
    string BgColor,
    string BorderColor,
    int Doctors,
    string AvgTime,
    float Rating,
    double Price,
    string[] Features,
    bool Available,
    int PatientsSatisfied,
    string WaitTime,
    string NextAvailable
    );