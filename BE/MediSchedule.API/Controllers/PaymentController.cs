using MediSchedule.Application.DTOs;
using MediSchedule.Application.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(IPaymentGateway paymentGateway) : Controller
{
    [HttpPost("momo/create-intent")]
    public async Task<IActionResult> CreateMomoPayment([FromBody] MomoRequest request)
    {
        try
        {
            var result = await paymentGateway.CreatePaymentIntentAsync(request);
            return Ok(GlobalResponse<PaymentResponse>.Success(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, GlobalResponse<string>.Error(ex.Message, 500));
        }
    }
}