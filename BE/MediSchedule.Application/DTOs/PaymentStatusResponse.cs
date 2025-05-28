namespace MediSchedule.Application.DTOs;

public record PaymentStatusResponse(
    string OrderId,
    string Status,
    string Message
    );