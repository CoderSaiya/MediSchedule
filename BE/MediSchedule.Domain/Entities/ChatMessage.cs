using System.ComponentModel.DataAnnotations.Schema;
using MediSchedule.Domain.Common;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Domain.Entities;

public class ChatMessage : BaseEntity
{
    public Guid SessionId { get; set; }
    [ForeignKey("SessionId")]
    public ChatSession Session { get; set; } = null!;
    
    public ChatType SenderType { get; set; }
    public string Content { get; set; } = null!;
}