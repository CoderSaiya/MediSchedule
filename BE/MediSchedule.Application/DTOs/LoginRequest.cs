namespace MediSchedule.Application.DTOs;

public record LoginRequest(
    string Username,
    string Password
    );