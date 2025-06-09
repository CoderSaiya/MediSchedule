using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IDoctorRepository : IRepository<Doctor>
{
    Task<bool> IsLicenseUniqueAsync(string licenseNumber, Guid? excludeId = null);
}