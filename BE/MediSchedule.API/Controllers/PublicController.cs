using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Doctors.Queries;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicController(IMediator mediator): Controller
{
    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctors()
    {
        var doctors = await mediator.Send(new GetDoctorsQuery());
        
        return Ok(GlobalResponse<IEnumerable<DoctorResponse>>.Success(doctors));
    }
}