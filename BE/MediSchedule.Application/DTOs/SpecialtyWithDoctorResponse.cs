namespace MediSchedule.Application.DTOs;

public record SpecialtyWithDoctorResponse(
    string Name,
    string[] DoctorNames,
    double Amount
    );