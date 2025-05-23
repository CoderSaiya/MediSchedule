using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Specifications;

public class ChatSessionFilter
{
    public Guid? PatientId { get; set; }
    public ChatSessionStatus? Status { get; set; }
    public DateTime? EndedBefore { get; set; }
}