using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Appointments.Commands;

public record ScheduleAppointmentCommand(Appointment Appointment) : IRequest<Unit>;