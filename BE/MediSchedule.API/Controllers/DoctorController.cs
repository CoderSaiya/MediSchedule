using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Statistics.Queries;
using MediSchedule.Domain.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorController(IMediator mediator) : Controller
{
    [HttpGet("statistics/{doctorId:guid}")]
    public async Task<IActionResult> GetDoctorStatistics(
        [FromRoute] Guid doctorId,
        [FromQuery] TimeZoneInfo? tz = null
        )
    {
        var statistics = await mediator.Send(new GetDoctorStatisticsQuery(doctorId, tz));
        
        return Ok(GlobalResponse<DoctorStatistics>.Success(statistics));
    }
}