namespace MediSchedule.Application.DTOs;

public record SpecialtyWithDoctorResponse(
    Guid Id,
    string Name,
    DoctorDto[] DoctorNames,
    double Amount
    );