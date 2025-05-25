using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Application.UseCases.Slots.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class ScheduleAppointmentHandler(
    IAppointmentRepository appointmentRepository,
    ISlotRepository slotRepository,
    INotificationRepository notificationRepository,
    IUnitOfWork unitOfWork,
    IMediator mediator,
    INotificationService notificationService
    ) : IRequestHandler<ScheduleAppointmentCommand, Unit>
{
    public async Task<Unit> Handle(ScheduleAppointmentCommand request, CancellationToken cancellationToken)
    {
        var slot = await slotRepository.GetByIdAsync(request.Appointment.SlotId);
        if (slot is null)
            throw new Exception("Slot not found");
        
        if (!slot.IsAvailable)
            throw new Exception("Slot is not available");
        
        var alreadyBooked = await appointmentRepository
            .GetByPredicateAsync(a =>
                a.SlotId == request.Appointment.SlotId &&
                a.PatientId == request.Appointment.PatientId
            );
        
        if (alreadyBooked is not null)
            throw new Exception("You are already booked this slot");
        
        await appointmentRepository.AddAsync(request.Appointment);
        
        await mediator.Send(new BlockSlotCommand(slot.Id), cancellationToken);
        
        var notificationPatient = new Notification
        {
            UserId = request.Appointment.PatientId,
            Content = "You have booked this appointment at " +
                      $"{slot.StartTime:yyyy-MM-dd HH:mm} to {slot.EndTime:yyyy-MM-dd HH:mm}.",
        };

        var notificationDoctor = new Notification
        {
            UserId = request.Appointment.DoctorId,
            Content = $"Patient with ID {request.Appointment.PatientId} has scheduled an appointment from " +
                      $"{slot.StartTime:yyyy-MM-dd HH:mm} to {slot.EndTime:yyyy-MM-dd HH:mm}."
        };
        
        await notificationRepository.AddAsync(notificationPatient);

        await notificationService.PushNotificationAsync(notificationPatient.UserId.ToString(), notificationPatient);
        await notificationService.PushNotificationAsync(notificationDoctor.UserId.ToString(), notificationDoctor);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}