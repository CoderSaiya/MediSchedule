using MediatR;

namespace MediSchedule.Application.UseCases.Authentication.Command;

public record RegisterCommand(
    string FullName,
    string Username,
    string Email,
    string Password
    ) : IRequest<Guid>;