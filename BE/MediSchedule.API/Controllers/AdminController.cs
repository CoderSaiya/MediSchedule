using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Application.UseCases.Hospitals.Commands;
using MediSchedule.Application.UseCases.Medicines.Commands;
using MediSchedule.Application.UseCases.Monitors.Queries;
using MediSchedule.Application.UseCases.Notifications.Commands;
using MediSchedule.Application.UseCases.Users.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;
using MediSchedule.Infrastructure.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(IMediator mediator, IHubContext<NotificationHub> hubContext) : Controller
{
    // [HttpPost("notification/{userId:guid}")]
    // public async Task<IActionResult> SendNotification([FromRoute] Guid userId, [FromBody] SendNotificationRequest request)
    // {
    //     var lowerEnumNames = Enum
    //         .GetNames(typeof(NotificationType))
    //         .Select(name => name.ToLowerInvariant());
    //
    //     bool exists = lowerEnumNames.Contains(request.Type.ToLowerInvariant());
    //     
    //     if (exists)
    //     {
    //         Console.WriteLine($"Parsed thành công: {request.Type}");
    //     }
    //     else
    //     {
    //         return StatusCode(300, GlobalResponse<string>.Error($"{request.Type} không hợp lệ", 300));
    //     }
    //     
    //     try
    //     {
    //         var notification = new Notification
    //         {
    //             UserId = userId,
    //             
    //         };
    //         await mediator.Send(
    //             new SendNotificationCommand(notification));
    //         
    //         return Ok(GlobalResponse<string>.Success("User created successfully."));
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
    //     }
    // }
    
    [HttpPost("doctor")]
    public async Task<IActionResult> CreateDoctor([FromForm] CreateDoctorRequest request)
    {
        try
        {
            await mediator.Send(
                new CreateDoctorCommand(request));
            
            return Ok(GlobalResponse<string>.Success("User created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpPut("doctor")]
    public async Task<IActionResult> UpdateDoctor([FromForm] UpdateDoctorCommand command)
    {
        try
        {
            await mediator.Send(command);
            
            return Ok(GlobalResponse<string>.Success("Doctor updated successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpDelete("doctor")]
    public async Task<IActionResult> DeleteDoctor([FromForm] DeleteDoctorCommand command)
    {
        try
        {
            await mediator.Send(command);
            
            return Ok(GlobalResponse<string>.Success("User created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] UserFiler filter)
    {
        var appointments = await mediator.Send(
            new GetUsersQuery(filter));
        
        return Ok(GlobalResponse<IEnumerable<User>>.Success(appointments));
    }

    [HttpPost("medicine")]
    public async Task<IActionResult> CreateMedicine([FromBody] CreateMedicineRequest request)
    {
        try
        {
            var medicine = new Medicine
            {
                Name = request.Name,
                GenericName = request.GenericName ?? null,
                Strength = request.Strength ?? null,
                Manufacturer = request.Manufacturer ?? null,
                Description = request.Description,
            };

            await mediator.Send(
                new CreateMedicineCommand(medicine));

            return Ok(GlobalResponse<string>.Success($"Medicine {request.Name} created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpPut("medicine")]
    public async Task<IActionResult> CreateMedicine([FromForm] UpdateMedicineCommand command)
    {
        try
        {
            await mediator.Send(command);

            return Ok(GlobalResponse<string>.Success($"Medicine {command.Name} created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpDelete("medicine/{id:guid}")]
    public async Task<IActionResult> CreateMedicine([FromRoute] Guid id)
    {
        try
        {
            await mediator.Send(
                new DeleteMedicineCommand(id));

            return Ok(GlobalResponse<string>.Success($"Medicine {id} created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpGet("db-stats")]
    public async Task<ActionResult<DatabaseStatsResponse>> GetDatabaseStats()
    {
        var stats = await mediator.Send(
            new GetDatabaseStatsQuery());
        return Ok(GlobalResponse<DatabaseStatsResponse>.Success(stats));
    }
    
    [HttpGet("sys-stats")]
    public async Task<ActionResult<SystemStatsResponse>> GetSystemStats()
    {
        var stats = await mediator.Send(
            new GetSystemStatsQuery());
        return Ok(GlobalResponse<SystemStatsResponse>.Success(stats));
    }

    [HttpPost("hospital")]
    public async Task<IActionResult> CreateHospital([FromForm] CreateHospitalRequest request)
    {
        try
        {
            await mediator.Send(
                new CreateHospitalCommand(request));
            
            return Ok(GlobalResponse<string>.Success("Hospital created successfully."));
        }
        catch (Exception e)
        {
            return StatusCode(500, GlobalResponse<string>.Error(e.Message, 500));
        }
    }
    
    [HttpPut("hospital/{hospitalId:guid}/add-doctor")]
    public async Task<IActionResult> AddDoctorsToHospital(
        [FromRoute] Guid hospitalId,
        [FromForm] List<Guid> doctorIds
        )
    {
        try
        {
            var addedDoctorIds = (await mediator.Send(
                new AddDoctorCommand(hospitalId, doctorIds))).ToList();
            
            return Ok(GlobalResponse<IEnumerable<Guid>>.Success(
                data: addedDoctorIds,
                message: $"{addedDoctorIds.Count()} doctors added successfully"
            ));
        }
        catch (Exception e)
        {
            return StatusCode(500, GlobalResponse<string>.Error(e.Message, 500));
        }
    }
    
    [HttpPut("hospital")]
    public async Task<IActionResult> UpdateHospital([FromForm] UpdateHospitalCommand command)
    {
        try
        {
            await mediator.Send(command);
            
            return Ok(GlobalResponse<string>.Success("Hospital created successfully."));
        }
        catch (Exception e)
        {
            return StatusCode(500, GlobalResponse<string>.Error(e.Message, 500));
        }
    }
    
    [HttpDelete("hospital/{id:guid}")]
    public async Task<IActionResult> CreateHospital([FromRoute] Guid id)
    {
        try
        {
            await mediator.Send(
                new DeleteHospitalCommand(id));
            
            return Ok(GlobalResponse<string>.Success("Hospital created successfully."));
        }
        catch (Exception e)
        {
            return StatusCode(500, GlobalResponse<string>.Error(e.Message, 500));
        }
    }
    
    [HttpPost("send-to-doctors")]
    public async Task<IActionResult> SendToDoctors([FromBody] SendNotificationRequest req)
    {
        if (!req.DoctorIds.Any() || string.IsNullOrWhiteSpace(req.Message))
            return BadRequest("DoctorIds và Message không được rỗng.");

        var timestamp = DateTime.UtcNow;
        foreach (var doctorId in req.DoctorIds)
        {
            var groupName = NotificationHub.GetGroupName(doctorId);
            await hubContext.Clients.Group(groupName).SendAsync("ReceiveNotification", new {
                Content = req.Message,
                Timestamp = timestamp,
                From = "Admin"
            });
        }
        return Ok(new { SentTo = req.DoctorIds.Count });
    }
}