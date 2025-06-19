using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Doctors.Commands;

public record UpdateDoctorCommand(Doctor Doctor) : IRequest<Unit>;