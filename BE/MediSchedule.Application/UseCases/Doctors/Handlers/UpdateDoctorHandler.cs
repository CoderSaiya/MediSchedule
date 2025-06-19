using MediatR;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class UpdateDoctorHandler(IDoctorRepository doctorRepository) : IRequestHandler<UpdateDoctorCommand, Unit>
{
    public Task<Unit> Handle(UpdateDoctorCommand request, CancellationToken cancellationToken)
        => doctorRepository.UpdateAsync(request.Doctor)
            .ContinueWith(_ => Unit.Value, cancellationToken);
}