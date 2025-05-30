using MediatR;
using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.UseCases.Storages.Commands;

public record StorageToBlobCommand(
    Guid AppointmentId,
    string ContainerName,
    IFormFile File
    ) : IRequest<string>;