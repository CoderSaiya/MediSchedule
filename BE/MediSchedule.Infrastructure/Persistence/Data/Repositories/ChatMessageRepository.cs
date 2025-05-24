using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class ChatMessageRepository(AppDbContext context) : GenericRepository<ChatMessage>(context), IChatMessageRepository
{
    
}