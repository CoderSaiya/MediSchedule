using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Profiles.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Profiles.Handlers;

public class UpdateProfileHandler(
    IBlobService blobService,
    IProfileRepository profileRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<UpdateProfileCommand, Unit>
{
    public async Task<Unit> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = request.Profile;
        if (request.AvatarFile != null)
        {
            profile.AvatarUrl = await blobService.UploadFileAsync("avatars", request.AvatarFile);
        }
        
        await profileRepository.UpdateAsync(profile);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}