using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Hospitals.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Hospitals.Handlers;

public class DeleteHospitalHandler(
    IHospitalRepository hospitalRepository,
    IUnitOfWork unitOfWork,
    IBlobService blobService
    ) : IRequestHandler<DeleteHospitalCommand, Unit>
{
    public async Task<Unit> Handle(DeleteHospitalCommand request, CancellationToken cancellationToken)
    {
        var hospital = await hospitalRepository.GetByIdAsync(request.HospitalId);
        if (hospital is null)
            throw new Exception($"Hospital with ID {request.HospitalId} not found.");
        
        foreach (var doc in hospital.Doctors)
        {
            doc.HospitalId = null;
        }

        var fileUrl = hospital.CoverImage;
        
        await hospitalRepository.DeleteAsync(hospital.Id);
        
        await unitOfWork.CommitAsync();
        
        await blobService.DeleteFileAsync(fileUrl);
        
        return Unit.Value;
    }
}