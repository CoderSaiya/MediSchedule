using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Slots.Queries;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotController(IMediator mediator) : Controller
{
    [HttpGet]
    public async Task<ActionResult> Get(
        [FromQuery] Guid doctorId,
        [FromQuery] DateTime date)
    {
        var slots = await mediator.Send(
            new GetTimeSlotQuery(doctorId, date));
        
        return Ok(GlobalResponse<IEnumerable<TimeSlotResponse>>.Success(slots));
    }
}