using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Domain.Interfaces;

public interface ISlotRepository : IRepository<Slot>
{
    Task<IEnumerable<Slot>> GetAvailableAsync(SlotFilter filter);
    Task<IEnumerable<Slot>> GetSlotsByDoctorAsync(Guid doctorId, DayOfWeek day);
}