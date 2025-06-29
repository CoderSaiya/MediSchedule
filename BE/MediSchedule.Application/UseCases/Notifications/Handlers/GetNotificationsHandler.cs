using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Notifications.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Notifications.Handlers;

public class GetNotificationsHandler(INotificationRepository notificationRepository) : IRequestHandler<GetNotificationsQuery, IEnumerable<NotificationResponse>>
{
    public async Task<IEnumerable<NotificationResponse>> Handle(GetNotificationsQuery request,
        CancellationToken cancellationToken) =>
        (await notificationRepository.ListAsync()).Select(n => new NotificationResponse(
            Id: n.Id,
            Recipient: $"BS. {n.User.Profile!.FullName}",
            NotificationType: n.Type.ToString(),
            Content: n.Content,
            CreatedAt: n.CreatedAt.ToString("HH:mm:ss dd/MM/yyyy")
        ));
}