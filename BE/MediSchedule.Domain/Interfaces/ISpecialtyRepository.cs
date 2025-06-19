using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Domain.Interfaces;

public interface ISpecialtyRepository : IRepository<Specialty>
{
    Task<IEnumerable<Specialty>> ListAsync(SpecialtyFilter filter);
}