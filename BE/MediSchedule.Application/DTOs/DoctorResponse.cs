namespace MediSchedule.Application.DTOs;

public record DoctorResponse(
    Guid Id,
    string Name,
    string Specialty,
    string Hospital,
    string LicenseNumber,
    string Biography,
    double Rating,
    int Reviews,
    string Image,
    bool Available
    );