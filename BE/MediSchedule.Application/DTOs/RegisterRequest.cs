﻿namespace MediSchedule.Application.DTOs;

public record RegisterRequest(
    string FullName,
    string Username,
    string Email,
    string Password
    );