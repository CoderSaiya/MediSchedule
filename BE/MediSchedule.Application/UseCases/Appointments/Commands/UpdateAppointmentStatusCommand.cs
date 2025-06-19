using MediatR;

namespace MediSchedule.Application.UseCases.Appointments.Commands;

public record UpdateAppointmentStatusCommand(Guid AppointmentId, string Status) : IRequest<Guid>;