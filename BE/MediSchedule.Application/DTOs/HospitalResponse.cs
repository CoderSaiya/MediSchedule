using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Application.DTOs;

public record HospitalResponse(
    Guid Id,
    string Name,
    string Phone,
    string Email,
    string Description,
    Coordinates Coordinates,
    List<string> Specialties,
    string Image,
    string CreatedAt,
    string UpdatedAt
    );