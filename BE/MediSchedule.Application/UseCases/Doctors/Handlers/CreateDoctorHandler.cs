using MediatR;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class CreateDoctorHandler(IDoctorRepository doctorRepository) : IRequestHandler<CreateDoctorCommand, Unit>
{
    public Task<Unit> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
        => doctorRepository.AddAsync(request.Doctor)
            .ContinueWith(_ => Unit.Value, cancellationToken);
}