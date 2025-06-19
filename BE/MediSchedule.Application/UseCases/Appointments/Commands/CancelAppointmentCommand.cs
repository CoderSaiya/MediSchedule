using MediatR;

namespace MediSchedule.Application.UseCases.Appointments.Commands;

public record CancelAppointmentCommand(Guid AppointmentId) : IRequest<Unit>;