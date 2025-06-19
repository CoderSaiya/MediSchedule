using MediatR;
using MediSchedule.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Prescriptions.Commands;

public record CreatePrescriptionCommand(
    Guid AppointmentId,
    string? Notes,
    IFormFile File,
    List<CreatePrescriptionMedicationDto> Items
    ) : IRequest<PrescriptionResponse>;