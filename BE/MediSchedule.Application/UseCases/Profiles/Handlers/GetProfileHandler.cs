using MediatR;
using MediSchedule.Application.UseCases.Profiles.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Profiles.Handlers;

public class GetProfileHandler(IProfileRepository profileRepository) : IRequestHandler<GetProfileQuery, Profile?>
{
    public async Task<Profile?> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        => await profileRepository.GetByUserIdAsync(request.UserId);
}