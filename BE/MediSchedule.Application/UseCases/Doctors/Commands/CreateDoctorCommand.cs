using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Doctors.Commands;

public record CreateDoctorCommand(Doctor Doctor) : IRequest<Unit>;