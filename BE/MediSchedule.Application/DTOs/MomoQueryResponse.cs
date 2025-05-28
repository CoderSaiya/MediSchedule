using System.Text.Json.Serialization;

namespace MediSchedule.Application.DTOs;

public class MomoQueryResponse
{
    [JsonPropertyName("resultCode")]
    public int ResultCode { get; set; }
    [JsonPropertyName("message")]
    public string? Message { get; set; }
    [JsonPropertyName("localMessage")] 
    public string? LocalMessage { get; set; }
}