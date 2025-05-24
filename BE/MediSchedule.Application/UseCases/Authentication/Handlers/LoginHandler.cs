using System.Security.Claims;
using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Authentication.Command;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Authentication.Handlers;

public class LoginHandler(
    IAuthService authService,
    IUserRepository userRepository,
    IRefreshRepository refreshRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<LoginCommand, TokenResponse>
{
    public async Task<TokenResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUsernameAsync(request.Username);
        if (user == null)
            throw new Exception("User with this email not exists.");
        
        if (!authService.VerifyPassword(request.Password, user.Password))
            throw new Exception("Invalid password.");
        
        var validToken = await refreshRepository.GetValidTokenByUserAsync(user.Id);
        if (validToken != null)
            validToken.IsRevoked = true;
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user is Admin ? "Admin" : user is Patient ? "Patient" : "Doctor"),
        };
        
        var newAccessToken = authService.GenerateAccessToken(claims);
        var newRefreshToken = authService.GenerateRefreshToken();
        
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshToken,
            
        };
        await refreshRepository.AddAsync(refreshToken);
        
        await unitOfWork.CommitAsync();
        
        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}