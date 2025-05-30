using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Storages.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Storages.Handlers;

public class StorageToBlobHandler(
    IAppointmentRepository appointmentRepository,
    IBlobService blobService,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<StorageToBlobCommand, string>
{
    public async Task<string> Handle(StorageToBlobCommand request, CancellationToken cancellationToken)
    {
        var blobUrl = await blobService.UploadFileAsync(request.ContainerName, request.File);
        
        var appointment = await appointmentRepository.GetByIdAsync(request.AppointmentId);
        if (appointment is not null)
        {
            var url = appointment.FileUrl;
            if (appointment.FileUrl is not null)
                await blobService.DeleteFileAsync(appointment.FileUrl);
            
            appointment.FileUrl = blobUrl;
            
            await appointmentRepository.UpdateAsync(appointment);
            
            await unitOfWork.CommitAsync();
        }
        
        return blobUrl;
    }
}