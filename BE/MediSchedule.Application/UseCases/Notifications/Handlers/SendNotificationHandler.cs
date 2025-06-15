using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Notifications.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Notifications.Handlers;

public class SendNotificationHandler(
    INotificationService notificationService,
    INotificationRepository notificationRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<SendNotificationCommand, Unit>
{
    public async Task<Unit> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = request.Notification;
        
        await notificationRepository.AddAsync(notification);
        
        await unitOfWork.CommitAsync();
        
        await notificationService.PushNotificationAsync(notification.UserId, notification);
        
        return Unit.Value;
    }
}