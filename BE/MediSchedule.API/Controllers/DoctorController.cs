﻿using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Commands;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Application.UseCases.Medicines.Queries;
using MediSchedule.Application.UseCases.Prescriptions.Commands;
using MediSchedule.Application.UseCases.Profiles.Queries;
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreatePrescription([FromForm] CreatePrescriptionRequest request)
    {
        var prescription = await mediator.Send(
            new CreatePrescriptionCommand(request.AppointmentId, request.Notes, request.File, request.Items));

        return Ok(GlobalResponse<PrescriptionResponse>.Success(prescription, "Create prescription success!"));
    }

    [HttpGet("medicines")]
    public async Task<IActionResult> GetMedicines()
    {
        var medicines = await mediator.Send(
            new GetMedicinesQuery());
        
        return Ok(GlobalResponse<IEnumerable<MedicineResponse>>.Success(medicines));
    }

    [HttpGet("profile/{doctorId:guid}")]
    public async Task<IActionResult> GetProfile([FromRoute] Guid doctorId)
    {
        var profile = await mediator.Send(
            new GetDoctorProfileQuery(doctorId));

        return Ok(GlobalResponse<DoctorProfileResponse>.Success(profile));
    }

    [HttpPut("appointment/status/{appointmentId:guid}")]
    public async Task<IActionResult> UpdateAppointmentStatus(
        [FromRoute] Guid appointmentId,
        [FromForm] string status)
    {
        try
        {
            var id = await mediator.Send(
                new UpdateAppointmentStatusCommand(appointmentId, status));
            
            return Ok(GlobalResponse<string>.Success($"Appointment status with ID {appointmentId} updated to {status}"));
        }
        catch (Exception ex)
        {
            return BadRequest(GlobalResponse<string>.Error(ex.Message));
        }
    }
}