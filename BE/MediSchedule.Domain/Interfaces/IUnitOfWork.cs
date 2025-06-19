namespace MediSchedule.Domain.Interfaces;

public interface IUnitOfWork
{
    Task CommitAsync();
}