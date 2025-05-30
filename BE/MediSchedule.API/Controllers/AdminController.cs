﻿using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Application.UseCases.Notifications.Commands;
using MediSchedule.Application.UseCases.Users.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;
using MediSchedule.Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(IMediator mediator) : Controller
{
    [HttpPost("notification/{userId:guid}")]
    public async Task<IActionResult> SendNotification([FromRoute] Guid userId, [FromBody] SendNotificationRequest request)
    {
        var lowerEnumNames = Enum
            .GetNames(typeof(NotificationType))
            .Select(name => name.ToLowerInvariant());

        bool exists = lowerEnumNames.Contains(request.Type.ToLowerInvariant());
        
        if (exists)
        {
            Console.WriteLine($"Parsed thành công: {request.Type}");
        }
        else
        {
            return StatusCode(300, GlobalResponse<string>.Error($"{request.Type} không hợp lệ", 300));
        }
        
        try
        {
            var notification = new Notification
            {
                UserId = userId,
                
            };
            await mediator.Send(
                new SendNotificationCommand(notification));
            
            return Ok(GlobalResponse<string>.Success("User created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
    
    [HttpPost("doctor")]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorRequest request)
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
    
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] UserFiler filter)
    {
        var appointments = await mediator.Send(
            new GetUsersQuery(filter));
        
        return Ok(GlobalResponse<IEnumerable<User>>.Success(appointments));
    }
}