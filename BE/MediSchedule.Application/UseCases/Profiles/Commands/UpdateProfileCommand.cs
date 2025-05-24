using MediatR;
using MediSchedule.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Profiles.Commands;

public record UpdateProfileCommand(Profile Profile, IFormFile? AvatarFile) : IRequest<Unit>;