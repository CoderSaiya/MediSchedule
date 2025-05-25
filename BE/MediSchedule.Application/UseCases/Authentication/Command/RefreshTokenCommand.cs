using MediatR;

namespace MediSchedule.Application.UseCases.Authentication.Command;

public record RefreshTokenCommand(string RefreshToken) : IRequest<string>;