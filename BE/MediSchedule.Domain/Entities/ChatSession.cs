using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Entities;

public class ChatSession : BaseEntity
{
    public Guid PatientId { get; set; }
    [ForeignKey("PatientId")]
    public Patient Patient { get; set; } = null!;

    public DateTime? EndTime { get; set; } = null;
    public ChatSessionStatus Status { get; set; } = ChatSessionStatus.Opening;
}