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
        var req = request.Request;
        var existing = await profileRepository.GetByUserIdAsync(request.UserId);
        if (existing == null)
            throw new KeyNotFoundException($"Profile for user {request.UserId} not found.");
        
        if (!string.IsNullOrWhiteSpace(req.FullName))
            existing.FullName = req.FullName;

        if (!string.IsNullOrWhiteSpace(req.PhoneNumber))
            existing.PhoneNumber = req.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(req.Address))
            existing.Address = req.Address;

        if (!string.IsNullOrWhiteSpace(req.Dob) && DateTime.TryParse(req.Dob, out var dob))
            existing.Dob = dob.ToString("dd/MM/yyyy");
        
        if (req.Avatar != null)
        {
            if (!string.IsNullOrEmpty(existing.AvatarUrl))
                await blobService.DeleteFileAsync(existing.AvatarUrl);

            existing.AvatarUrl = await blobService.UploadFileAsync("avatars", req.Avatar);
        }
        
        await profileRepository.UpdateAsync(existing);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}