using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Notifications.Commands;

public record SendNotificationCommand(Notification Notification) : IRequest<Unit>;