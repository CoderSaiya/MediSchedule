using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Doctors.Commands;

public record UpdateDoctorCommand(
    Guid DoctorId,
    Guid? SpecialtyId,
    Guid? HospitalId,
    string? LicenseNumber,
    string? Biography,
    IFormFile? AvatarFile,
    string? FullName,
    string? Username,
    string? Password,
    List<SlotDto>? Slots
    ) : IRequest<Unit>;