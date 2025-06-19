namespace MediSchedule.Application.DTOs;

public record PaymentResponse(
    string PayUrl,
    string OrderId
    );