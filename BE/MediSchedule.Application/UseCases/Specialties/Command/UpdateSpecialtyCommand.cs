using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Specialties.Command;

public record UpdateSpecialtyCommand(Specialty Specialty) : IRequest<Unit>;