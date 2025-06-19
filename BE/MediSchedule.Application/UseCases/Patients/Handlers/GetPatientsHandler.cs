using MediatR;
using MediSchedule.Application.UseCases.Patients.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Patients.Handlers;

public class GetPatientsHandler(IPatientRepository patientRepository) : IRequestHandler<GetPatientsQuery, IEnumerable<Patient>>
{
    public Task<IEnumerable<Patient>> Handle(GetPatientsQuery request, CancellationToken cancellationToken)
        => patientRepository.ListAsync(request.Filter);
}