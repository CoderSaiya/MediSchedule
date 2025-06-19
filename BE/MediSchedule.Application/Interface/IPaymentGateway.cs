using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.Interface;

public interface IPaymentGateway
{
    Task<PaymentResponse> CreatePaymentIntentAsync(MomoRequest request);
    Task<PaymentStatusResponse> CheckPaymentStatusAsync(string orderId);
}