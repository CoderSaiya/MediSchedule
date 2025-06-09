using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.DTOs;

public record CreateHospitalRequest(
    string Name,
    string Address,
    string Phone,
    string Email,
    string Description,
    double Latitude,
    double Longitude,
    IFormFile File
    );