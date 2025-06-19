using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Patients.Commands;

public record UpdatePatientCommand(Patient Patient) : IRequest<Unit>;