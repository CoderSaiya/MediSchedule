using MediatR;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class CancelAppointmentHandler(
    IAppointmentRepository appointmentRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<CancelAppointmentCommand, Unit>
{
    public async Task<Unit> Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
    {
        var id = request.AppointmentId;
        var appointment = await appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
            throw new KeyNotFoundException($"No appointment found with Id {id}");

        await appointmentRepository.DeleteAsync(id);

        // Gửi thông báo
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}