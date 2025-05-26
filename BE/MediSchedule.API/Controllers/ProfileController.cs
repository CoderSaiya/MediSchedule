using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Profiles.Commands;
using MediSchedule.Application.UseCases.Profiles.Queries;
using MediSchedule.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController(IMediator mediator) : Controller
{
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetProfile([FromRoute] Guid userId)
    {
        var profile = await mediator.Send(new GetProfileQuery(userId));
        if (profile == null) return  NotFound(GlobalResponse<string>.Error("Profile not found."));
        
        return Ok(GlobalResponse<Profile>.Success(profile));
    }
    
    [HttpPut("{userId:guid}")]
    [RequestSizeLimit(10_000_000)] // 10MB
    public async Task<IActionResult> UpdateProfile(
        [FromRoute] Guid userId,
        [FromForm] UpdateProfileRequest dto)
    {
        var profile = new Profile
        {
            UserId = userId,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            Dob = dto.Dob
        };

        await mediator.Send(new UpdateProfileCommand(profile, dto.Avatar));
        return NoContent();
    }
}