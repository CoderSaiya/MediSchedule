namespace MediSchedule.Application.DTOs;

public record DoctorProfileResponse(
    string Name,
    string Specialty,
    string Avatar
    );