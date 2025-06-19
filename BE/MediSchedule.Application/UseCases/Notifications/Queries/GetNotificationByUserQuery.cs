using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Notifications.Queries;

public record GetNotificationByUserQuery(Guid UserId) : IRequest<IEnumerable<Notification>>;