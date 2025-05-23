using MediatR;
using MediSchedule.Application.UseCases.Patients.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Patients.Handlers;

public class GetPatientByIdHandler(IPatientRepository patientRepository) : IRequestHandler<GetPatientByIdQuery, Patient?>
{
    public Task<Patient?> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
        => patientRepository.GetByIdAsync(request.Id);
}