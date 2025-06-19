using MediatR;
using MediSchedule.Application.UseCases.Patients.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Patients.Handlers;

public class CreatePatientHandler(IPatientRepository patientRepository) : IRequestHandler<CreatePatientCommand, Unit>
{
    public Task<Unit> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        return patientRepository.AddAsync(request.Patient)
            .ContinueWith(_ => Unit.Value, cancellationToken);
    }
}