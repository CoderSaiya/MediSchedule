using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IHospitalRepository : IRepository<Hospital>
{
    Task<IEnumerable<Doctor>> GetByHospitalAsync(Guid hospitalId);
}