namespace MediSchedule.Domain.Entities;

public class Patient : User
{
    public ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();
}