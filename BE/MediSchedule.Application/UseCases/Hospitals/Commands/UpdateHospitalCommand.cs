using MediatR;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Hospitals.Commands;

public record UpdateHospitalCommand(
    Guid HospitalId,
    string? Name,
    string? Address,
    string? Phone,
    string? Email,
    string? Description,
    double? Latitude,
    double? Longitude,
    IFormFile? Image
    ) : IRequest<Unit>;