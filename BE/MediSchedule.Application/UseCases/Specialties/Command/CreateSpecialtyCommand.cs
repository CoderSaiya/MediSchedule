using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Specialties.Command;

public record CreateSpecialtyCommand(Specialty Specialty) : IRequest<Unit>;