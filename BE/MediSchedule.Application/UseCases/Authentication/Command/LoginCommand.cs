using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Authentication.Command;

public record LoginCommand(
    string Username,
    string Password
    ) : IRequest<TokenResponse>;