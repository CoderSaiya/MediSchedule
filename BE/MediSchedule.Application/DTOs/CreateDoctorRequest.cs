using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.DTOs;

public record CreateDoctorRequest(
    IFormFile AvatarFile,
    string FullName,
    string Username,
    string Password,
    string Email,
    Guid SpecialtyId,
    string LicenseNumber,
    string Biography,
    List<SlotDto> Slots
    );