using MediatR;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class ScheduleAppointmentHandler(
    IAppointmentRepository appointmentRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<ScheduleAppointmentCommand, Unit>
{
    public async Task<Unit> Handle(ScheduleAppointmentCommand request, CancellationToken cancellationToken)
    {
        await appointmentRepository.AddAsync(request.Appointment);
        
        // send notification
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}