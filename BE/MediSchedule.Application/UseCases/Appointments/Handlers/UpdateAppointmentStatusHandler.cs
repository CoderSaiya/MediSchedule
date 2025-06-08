using MediatR;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class UpdateAppointmentStatusHandler(
    IAppointmentRepository appointmentRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<UpdateAppointmentStatusCommand, Guid>
{
    public async Task<Guid> Handle(UpdateAppointmentStatusCommand request, CancellationToken cancellationToken)
    {
        var existing = await appointmentRepository.GetByIdAsync(request.AppointmentId);
        if (existing is null)
            throw new Exception($"Appointment with id: {request.AppointmentId} does not exist");
        
        var status = request.Status.ToLower() switch
        {
            var s when s == AppointmentStatus.Pending.ToString().ToLower()   => AppointmentStatus.Pending,
            var s when s == AppointmentStatus.Confirmed.ToString().ToLower() => AppointmentStatus.Confirmed,
            var s when s == AppointmentStatus.Completed.ToString().ToLower() => AppointmentStatus.Completed,
            _ => throw new ArgumentException($"Unknown status: {request.Status}")
        };
        existing.Status = status;
        
        await unitOfWork.CommitAsync();
        
        return existing.Id;
    }
}