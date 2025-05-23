using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence;

namespace MediSchedule.Infrastructure.Data.Repositories;

public class ChatSessionRepository(AppDbContext context) : GenericRepository<ChatSession>(context), IChatSessionRepository
{
    
}