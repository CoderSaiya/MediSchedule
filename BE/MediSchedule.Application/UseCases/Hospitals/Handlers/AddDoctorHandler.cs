using MediatR;
using MediSchedule.Application.UseCases.Hospitals.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Hospitals.Handlers;

public class AddDoctorHandler(
    IHospitalRepository hospitalRepository,
    IDoctorRepository doctorRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<AddDoctorCommand, IEnumerable<Guid>>
{
    public async Task<IEnumerable<Guid>> Handle(AddDoctorCommand request, CancellationToken cancellationToken)
    {
        var resultIds = new List<Guid>();
        var errors = new List<string>();
        var hospitalId = request.HospitalId;
        
        var hospital = await hospitalRepository.GetByIdAsync(hospitalId);
        if (hospital is null)
            throw new Exception("Hospital not found");

        foreach (var doctorId in request.DoctorIds)
        {
            var existingDoctor = await doctorRepository.GetByIdAsync(doctorId);
            if (existingDoctor is null)
            {
                errors.Add($"Doctor not already exists: {doctorId}");
                continue;
            }
            
            if (existingDoctor.HospitalId == hospitalId)
            {
                errors.Add($"Doctor already assigned to this hospital: {doctorId}");
                continue;
            }
            
            existingDoctor.HospitalId = hospitalId;
            await doctorRepository.UpdateAsync(existingDoctor);
            
            hospital.Doctors.Add(existingDoctor);
            
            resultIds.Add(doctorId);
        }
        
        await hospitalRepository.UpdateAsync(hospital);

        if (errors.Any())
        {
            throw new Exception(
                $"Failed to add some doctors: {string.Join("; ", errors)}");
        }

        await unitOfWork.CommitAsync();
        return resultIds;
    }
}