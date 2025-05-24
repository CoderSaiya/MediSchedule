using MediatR;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class GetAppointmentsHandler(IAppointmentRepository appointmentRepository) : IRequestHandler<GetAppointmentsQuery, IEnumerable<Appointment>>
{
    public async Task<IEnumerable<Appointment>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
        => await appointmentRepository.ListAsync(request.Filter);
}