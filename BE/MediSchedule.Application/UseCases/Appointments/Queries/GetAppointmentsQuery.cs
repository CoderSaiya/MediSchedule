using MediatR;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Appointments.Queries;

public record GetAppointmentsQuery(AppointmentFilter Filter) : IRequest<IEnumerable<Appointment>>;