namespace MediSchedule.Application.Interface;

public interface IMailService
{
    public Task SendEmailAsync(string toEmail, string subject, string body);
}