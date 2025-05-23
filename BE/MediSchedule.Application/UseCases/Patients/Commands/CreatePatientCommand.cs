using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Patients.Commands;

public record CreatePatientCommand(Patient Patient) : IRequest<Unit>;