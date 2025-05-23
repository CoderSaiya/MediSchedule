using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Patients.Queries;

public record GetPatientByIdQuery(Guid Id) : IRequest<Patient?>;