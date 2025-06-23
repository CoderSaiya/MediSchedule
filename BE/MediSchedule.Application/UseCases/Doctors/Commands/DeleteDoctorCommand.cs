using MediatR;

namespace MediSchedule.Application.UseCases.Doctors.Commands;

public record DeleteDoctorCommand(Guid DoctorId) : IRequest<Unit>;