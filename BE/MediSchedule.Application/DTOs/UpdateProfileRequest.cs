using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.DTOs;

public record UpdateProfileRequest(
    string? FullName,
    string? PhoneNumber,
    string? Address,
    string? Dob,
    Guid? SpecialtyId,
    string? LicenseNumber,
    string? Biography,
    IFormFile? Avatar
    );