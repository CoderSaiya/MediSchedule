using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Doctors.Queries;
using MediSchedule.Application.UseCases.Storages.Commands;
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

    [HttpPost("storage/{appointmentId}")]
    public async Task<IActionResult> GetStorage(
        [FromBody] StorageRequest storageRequest,
        [FromRoute] Guid? appointmentId = null
        )
    {
        var url = await mediator.Send(
            new StorageToBlobCommand(
                appointmentId ?? Guid.NewGuid(), 
                storageRequest.ContainerName, 
                storageRequest.File
                ));
        
        return Ok(GlobalResponse<string>.Success(url));
    }
}