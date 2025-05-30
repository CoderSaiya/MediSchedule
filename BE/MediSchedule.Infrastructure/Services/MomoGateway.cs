﻿using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.Interface;
using MediSchedule.Domain.Common;
using Microsoft.Extensions.Options;

namespace MediSchedule.Infrastructure.Services;

public class MomoGateway(
    IOptions<MomoOptions> momoOptions,
    HttpClient httpClient
    ) : IPaymentGateway
{
    private readonly MomoOptions _momoConfig = momoOptions.Value;
    
    public async Task<PaymentResponse> CreatePaymentIntentAsync(MomoRequest request)
    {
        var orderId = Guid.NewGuid().ToString();
        var requestId = Guid.NewGuid().ToString();
        var amount = (long)(request.Amount);
        
        var rawHash = new StringBuilder()
            .Append($"accessKey={_momoConfig.AccessKey}")
            .Append($"&amount={amount}")
            .Append("&extraData=")
            .Append($"&ipnUrl={_momoConfig.NotifyUrl}")
            .Append($"&orderId={orderId}")
            .Append("&orderInfo=Thanh toán qua mã QR MoMo")
            .Append($"&partnerCode={_momoConfig.PartnerCode}")
            .Append($"&redirectUrl={_momoConfig.ReturnUrl}")
            .Append($"&requestId={requestId}")
            .Append("&requestType=captureWallet")
            .ToString();

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_momoConfig.SecretKey));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawHash));
        var signature = BitConverter.ToString(hashBytes)
            .Replace("-", string.Empty)
            .ToLowerInvariant();

        var payload = new
        {
            partnerCode = _momoConfig.PartnerCode,
            partnerName = "Test",
            storeId = "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo = "Thanh toán qua mã QR MoMo",
            redirectUrl = _momoConfig.ReturnUrl,
            ipnUrl = _momoConfig.NotifyUrl,
            lang = "vi",
            extraData = string.Empty,
            requestType = "captureWallet",
            signature
        };

        using var client = new HttpClient();
        var response = await client.PostAsJsonAsync(_momoConfig.Endpoint, payload);
        var momoResp = await response.Content.ReadFromJsonAsync<MomoResponse>();
        
        if (momoResp == null)
            throw new Exception("MoMo did not return any JSON.");

        if (momoResp.ResultCode != 0)
            throw new Exception($"MoMo Error #{momoResp.ResultCode}: {momoResp.Message}");

        return new PaymentResponse
        (
            PayUrl: momoResp.QrCodeUrl,
            OrderId: orderId
        );
    }
    
    public async Task<PaymentStatusResponse> CheckPaymentStatusAsync(string orderId)
    {
        Console.WriteLine(orderId);
        var requestId = Guid.NewGuid().ToString();
        var requestType = "transactionStatus";
        
        var payload = new
        {
            partnerCode = _momoConfig.PartnerCode,
            accessKey = _momoConfig.AccessKey,
            requestId,
            orderId,
            signature = GenerateStatusSignature(orderId, requestId, requestType)
        };
        
        Console.WriteLine("PAYLOAD JSON: " +
                          JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = false }));

        var resp = await httpClient.PostAsJsonAsync(_momoConfig.StatusEndpoint, payload);
        var body = await resp.Content.ReadAsStringAsync();
        Console.WriteLine("MoMo RESPONSE: " + body);
        
        if (!resp.IsSuccessStatusCode)
            throw new Exception($"MoMo status check failed ({(int)resp.StatusCode}): {body}");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var momoStatus = JsonSerializer.Deserialize<MomoQueryResponse>(body, options)
                         ?? throw new Exception("Invalid JSON");

        var status = momoStatus.ResultCode switch
        {
            0 => "success",
            1000 => "processing",
            _ => "failed"
        };
        
        Console.WriteLine($"MoMo Status: {momoStatus.ResultCode}");

        return new PaymentStatusResponse(
            OrderId: orderId,
            Status: status,
            Message: (momoStatus.LocalMessage ?? momoStatus.Message)!
        );
    }
    
    private string GenerateStatusSignature(string orderId, string requestId, string requestType)
    {
        var raw = new StringBuilder()
            .Append($"accessKey={_momoConfig.AccessKey}")
            .Append($"&orderId={orderId}")
            .Append($"&partnerCode={_momoConfig.PartnerCode}")
            .Append($"&requestId={requestId}")
            .ToString();
        
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_momoConfig.SecretKey));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(raw));
        var signature = BitConverter.ToString(hashBytes)
            .Replace("-", "")
            .ToLowerInvariant();

        return signature;
    }
}