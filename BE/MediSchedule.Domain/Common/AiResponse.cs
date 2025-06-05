namespace MediSchedule.Application.DTOs;

public class AiResponse
{
    public string disease_label { get; set; } = string.Empty;
    public string specialty_title { get; set; } = string.Empty;
    public double confidence { get; set; }
}