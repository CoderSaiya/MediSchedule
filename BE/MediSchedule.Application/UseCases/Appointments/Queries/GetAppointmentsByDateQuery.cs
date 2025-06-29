using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Appointments.Queries;

public record GetAppointmentsByDateQuery(DateTime Date) : IRequest<IEnumerable<TodayAppointmentResponse>>;