using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Appointments.Queries;

public record GetAppointmentByIdQuery(Guid Id) : IRequest<Appointment?>;