using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class ChatSessionRepository(AppDbContext context) : GenericRepository<ChatSession>(context), IChatSessionRepository
{
    
}