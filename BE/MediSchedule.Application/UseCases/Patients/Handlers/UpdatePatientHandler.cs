using MediatR;
using MediSchedule.Application.UseCases.Patients.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Patients.Handlers;

public class UpdatePatientHandler(IPatientRepository patientRepository) : IRequestHandler<UpdatePatientCommand, Unit>
{
    public Task<Unit> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    {
        return patientRepository.UpdateAsync(request.Patient)
            .ContinueWith(_ => Unit.Value, cancellationToken);
    }
}