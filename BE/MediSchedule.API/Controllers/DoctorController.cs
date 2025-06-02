using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Application.UseCases.Prescriptions.Commands;
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
        [FromQuery] string? tzId = null
    )
    {
        TimeZoneInfo? tzInfo = null;
        if (!string.IsNullOrWhiteSpace(tzId))
        {
            try
            {
                tzInfo = TimeZoneInfo.FindSystemTimeZoneById(tzId);
            }
            catch (TimeZoneNotFoundException)
            {
                return BadRequest($"Time zone '{tzId}' không hợp lệ.");
            }
        }

        var query = new GetDoctorStatisticsQuery(doctorId, tzInfo);
        var statistics = await mediator.Send(query);

        return Ok(GlobalResponse<DoctorStatistics>.Success(statistics));
    }
    
    [HttpGet("appointments/{doctorId:guid}")]
    public async Task<IActionResult> GetAppointments(
        [FromRoute] Guid doctorId
    )
    {
        var appointments = await mediator.Send(
            new GetAppointmentsByDoctorQuery(doctorId));

        return Ok(GlobalResponse<IEnumerable<AppointmentResponse>>.Success(appointments));
    }
    
    [HttpGet("appointments-today/{doctorId:guid}")]
    public async Task<IActionResult> GetTodayAppointments(
        [FromRoute] Guid doctorId
    )
    {
        var appointments = await mediator.Send(
            new GetTodayAppointmentByDoctorQuery(doctorId));

        return Ok(GlobalResponse<IEnumerable<AppointmentResponse>>.Success(appointments));
    }

    [HttpPost("create-prescription")]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionRequest request)
    {
        var prescription = await mediator.Send(
            new CreatePrescriptionCommand(request.AppointmentId, request.Notes, request.File, request.Items));

        return Ok(GlobalResponse<PrescriptionResponse>.Success(prescription, "Create prescription success!"));
    }
}