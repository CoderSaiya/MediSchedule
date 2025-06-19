using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Hospitals.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Application.UseCases.Hospitals.Handlers;

public class CreateHospitalHandler(
    IHospitalRepository hospitalRepository,
    IUnitOfWork unitOfWork,
    IBlobService blobService
    ) : IRequestHandler<CreateHospitalCommand, Unit>
{
    public async Task<Unit> Handle(CreateHospitalCommand request, CancellationToken cancellationToken)
    {
        var hospital = new Hospital
        {
            Name = request.Request.Name,
            Address = request.Request.Address,
            Phone = request.Request.Phone,
            Email = request.Request.Email,
            Description = request.Request.Description,
            Coordinates = new Coordinates
            {
                Longitude = request.Request.Longitude,
                Latitude = request.Request.Latitude,
            }
        };
        await hospitalRepository.AddAsync(hospital);
        
        var fileUrl = await blobService.UploadFileAsync("hospitals", request.Request.File);
        
        hospital.CoverImage = fileUrl;

        await unitOfWork.CommitAsync();

        return Unit.Value;
    }
}