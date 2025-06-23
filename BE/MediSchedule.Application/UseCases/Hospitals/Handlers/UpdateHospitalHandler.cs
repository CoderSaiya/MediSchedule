using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Hospitals.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Hospitals.Handlers;

public class UpdateHospitalHandler(
    IHospitalRepository hospitalRepository,
    IUnitOfWork unitOfWork,
    IBlobService blobService
    ) : IRequestHandler<UpdateHospitalCommand, Unit>
{
    public async Task<Unit> Handle(UpdateHospitalCommand request, CancellationToken cancellationToken)
    {
        var hospital = await hospitalRepository.GetByIdAsync(request.HospitalId);
        
        if (hospital is null)
            throw new Exception($"Hospital with ID {request.HospitalId} not found.");
        
        hospital.Name = string.IsNullOrWhiteSpace(request.Name) ? hospital.Name :request.Name.Trim();
        hospital.Address = string.IsNullOrWhiteSpace(request.Address) ? hospital.Address : request.Address.Trim();
        hospital.Phone = string.IsNullOrWhiteSpace(request.Phone) ? hospital.Phone : request.Phone.Trim(); 
        hospital.Email = string.IsNullOrWhiteSpace(request.Email) ? hospital.Email : request.Email.Trim();
        hospital.Description = string.IsNullOrWhiteSpace(request.Description) ? hospital.Description : request.Description.Trim();
        
        if (request.Latitude.HasValue && request.Longitude.HasValue)
        {
            hospital.Coordinates.Latitude = request.Latitude.Value;
            hospital.Coordinates.Longitude = request.Longitude.Value;
        }
        
        if (request.Image != null && request.Image.Length > 0)
        {
            await blobService.DeleteFileAsync(hospital.CoverImage);
            var imageUrl = await blobService.UploadFileAsync("hospitals", request.Image);
            hospital.CoverImage = imageUrl;
        }
        
        await hospitalRepository.UpdateAsync(hospital);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}