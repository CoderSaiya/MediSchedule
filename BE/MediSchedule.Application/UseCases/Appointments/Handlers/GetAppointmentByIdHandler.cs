using MediatR;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class GetAppointmentByIdHandler(IAppointmentRepository appointmentRepository) : IRequestHandler<GetAppointmentByIdQuery, Appointment?>
{
    public async Task<Appointment?> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        => await appointmentRepository.GetByIdAsync(request.Id);
}