using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController(IMediator mediator) : Controller
{
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetAppointments([FromRoute] Guid userId)
    {
        var appointment = await mediator.Send(new GetAppointmentByIdQuery(userId));
        if (appointment == null) return  NotFound(GlobalResponse<string>.Error("Appointment not found."));
        
        return Ok(GlobalResponse<Appointment>.Success(appointment));
    }
    
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] CreateAppointmentRequest request)
    {
        try
        {
            var appointment = new Appointment
            {
                DoctorId = request.DoctorId,
                SlotId = request.SlotId,
                AppointmentDate = request.AppointmentDate,
                AppointmentTime = TimeSpan.Parse(request.AppointmentTime),
                Reason = request.Reason,
            };
            
            await mediator.Send(new ScheduleAppointmentCommand(appointment));
            
            return Ok(GlobalResponse<string>.Success("Appointment registered"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpPut("{appointmentId:guid}")]
    public async Task<IActionResult> CancelAppointment([FromRoute] Guid appointmentId)
    {
        try
        {
            await mediator.Send(new CancelAppointmentCommand(appointmentId));
            
            return Ok(GlobalResponse<string>.Success("Appointment canceled"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
}