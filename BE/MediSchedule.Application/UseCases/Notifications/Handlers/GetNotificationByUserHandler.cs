using MediatR;
using MediSchedule.Application.UseCases.Notifications.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Notifications.Handlers;

public class GetNotificationByUserHandler(INotificationRepository notificationRepository) : IRequestHandler<GetNotificationByUserQuery, IEnumerable<Notification>>
{
    public async Task<IEnumerable<Notification>> Handle(GetNotificationByUserQuery request, CancellationToken cancellationToken)
        => await notificationRepository.GetByUserIdAsync(request.UserId);
}