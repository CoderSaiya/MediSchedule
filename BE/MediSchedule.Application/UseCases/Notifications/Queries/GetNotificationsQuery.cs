using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Notifications.Queries;

public record GetNotificationsQuery() : IRequest<IEnumerable<NotificationResponse>>;