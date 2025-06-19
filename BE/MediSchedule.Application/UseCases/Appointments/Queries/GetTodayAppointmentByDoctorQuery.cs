using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Appointments.Queries;

public record GetTodayAppointmentByDoctorQuery(Guid DoctorId) : IRequest<IEnumerable<AppointmentResponse>>;