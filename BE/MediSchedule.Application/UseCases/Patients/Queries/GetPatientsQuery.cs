using MediatR;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Patients.Queries;

public record GetPatientsQuery(PatientFilter Filter) : IRequest<IEnumerable<Patient>>;