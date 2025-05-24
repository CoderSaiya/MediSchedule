using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Infrastructure.Persistence.Data.Repositories;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    public Task CommitAsync() => context.SaveChangesAsync();
}