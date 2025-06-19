namespace MediSchedule.Application.DTOs;

public record DoctorResponse(
    Guid Id,
    string Name,
    string Specialty,
    double Rating,
    int Reviews,
    string Image,
    bool Available
    );