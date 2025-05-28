using MediatR;
using MediSchedule.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Profiles.Commands;

public record UpdateProfileCommand(
    Guid UserId,
    UpdateProfileRequest Request
    ) : IRequest<Unit>;