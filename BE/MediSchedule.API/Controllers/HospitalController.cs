using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Hospitals.Queries;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HospitalController(IMediator mediator) : Controller
{
    [HttpGet]
    public async Task<IActionResult> GetHospitals()
    {
        var hospital = await mediator.Send(
            new GetHospitalsQuery());
        
        return Ok(GlobalResponse<IEnumerable<HospitalResponse>>.Success(hospital));
    }
}