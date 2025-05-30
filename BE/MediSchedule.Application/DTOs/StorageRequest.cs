using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.DTOs;

public record StorageRequest(
    string ContainerName,
    IFormFile File
    );