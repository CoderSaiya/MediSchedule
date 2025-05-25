using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Authentication.Command;

namespace MediSchedule.Application.UseCases.Authentication.Handlers;

public class RefreshTokenHandler(IAuthService authService) : IRequestHandler<RefreshTokenCommand, string>
{
    public async Task<string> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var newToken = await authService.RefreshTokenAsync(request.RefreshToken);
        if (newToken is null)
            throw new Exception("Invalid refresh token");
        
        return newToken;
    }
}