using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Profiles.Queries;

public record GetProfileQuery(Guid UserId) : IRequest<Profile?>;