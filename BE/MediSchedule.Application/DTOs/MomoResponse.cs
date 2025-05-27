namespace MediSchedule.Application.DTOs;

public record MomoResponse(
    int ResultCode,
    string Message,
    string OrderId,
    string RequestId,
    string PayUrl,
    string Deeplink,
    string QrCodeUrl
    );