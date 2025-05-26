using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Specialties.Command;
using MediSchedule.Application.UseCases.Specialties.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialtyController(IMediator mediator) : Controller
{
    [HttpGet]
    public async Task<IActionResult> GetSpecialties([FromQuery] SpecialtyFilter filter)
    {
        var specialties = await mediator.Send(new GetSpecialtiesQuery(filter));
        
        return Ok(GlobalResponse<IEnumerable<Specialty>>.Success(specialties));
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateSpecialties([FromBody] CreateSpecialty createSpecialty)
    {
        try
        {
            await mediator.Send(
                new CreateSpecialtyCommand(new Specialty
                {
                    Name = createSpecialty.Name,
                    Description = createSpecialty.Description,
                    Icon = createSpecialty.Icon,
                    Color = createSpecialty.Color,
                    BackgroundColor = createSpecialty.BackgroundColor,
                    BorderColor = createSpecialty.BorderColor,
                    Amount = createSpecialty.Amount,
                    AverageTime = createSpecialty.AverageTime,
                    PatientsSatisfied = createSpecialty.PatientsSatisfied,
                    WaitTime = createSpecialty.WaitTime,
                    IsAvailable = createSpecialty.IsAvailable,
                    FeaturesCsv = createSpecialty.Features
                }));
            
            return Ok(GlobalResponse<string>.Success("Specialty created successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
        
    }
}