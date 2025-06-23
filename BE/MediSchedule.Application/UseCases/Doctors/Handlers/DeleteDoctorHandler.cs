using MediatR;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class DeleteDoctorHandler(
    IDoctorRepository doctorRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<DeleteDoctorCommand, Unit>
{
    public async Task<Unit> Handle(DeleteDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = await doctorRepository.GetByIdAsync(request.DoctorId);
        if (doctor is null)
            throw new Exception($"Doctor with ID {request.DoctorId} not found.");
        
        await doctorRepository.DeleteAsync(doctor.Id);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}