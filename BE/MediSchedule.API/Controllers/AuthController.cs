using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Authentication.Command;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : Controller
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            await mediator.Send(
                new RegisterCommand(request.FullName, request.Username, request.Email, request.Password));
            
            return Ok(GlobalResponse<string>.Success("User created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
        
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await mediator.Send(new LoginCommand(request.Username, request.Password));
            return Ok(GlobalResponse<TokenResponse>.Success(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
    {
        try
        {
            var result = await mediator.Send(new RefreshTokenCommand(refreshToken));
            return Ok(GlobalResponse<string>.Success(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
}