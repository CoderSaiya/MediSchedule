using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class CreateDoctorHandler(
    IDoctorRepository doctorRepository,
    IUserRepository userRepository,
    ISlotRepository slotRepository,
    ISpecialtyRepository specialtyRepository,
    IAuthService authService,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<CreateDoctorCommand, Unit>
{
    public async Task<Unit> Handle(CreateDoctorCommand cmd, CancellationToken ct)
    {
        var req = cmd.Request;
        
        if (await doctorRepository.ExistsAsync(d => d.LicenseNumber == req.LicenseNumber))
            throw new Exception("License number already in use.");
        
        if (await userRepository.ExistsAsync(u => u.Username == req.Username || u.Email == req.Email))
            throw new Exception("Username or Email already taken.");
        
        if (!await specialtyRepository.ExistsAsync(s => s.Id == req.SpecialtyId))
            throw new Exception("Specialty doesn't exist.");
        
        var slots = req.Slots;
        for (int i = 0; i < slots.Count; i++)
        {
            if (slots[i].EndTime <= slots[i].StartTime)
                throw new Exception($"Slot {i+1}: EndTime must be after StartTime.");

            // check chồng lấn trong chính danh sách này
            for (int j = i + 1; j < slots.Count; j++)
            {
                bool overlap = slots[i].StartTime < slots[j].EndTime
                            && slots[j].StartTime < slots[i].EndTime;
                if (overlap)
                    throw new Exception($"Slot {i+1} overlaps with slot {j+1}.");
            }
        }
        
        foreach (var s in slots)
        {
            bool conflict = await slotRepository.ExistsAsync(ex =>
                ex.StartTime < s.EndTime &&
                s.StartTime < ex.EndTime);
            if (conflict)
                throw new Exception(
                  $"New slot {s.StartTime:yyyy-MM-dd HH:mm} – {s.EndTime:HH:mm} " +
                  "conflicts with existing slots in the system.");
        }
        
        var doctor = new Doctor
        {
            Username = req.Username,
            Email = req.Email,
            Password = authService.HashPassword(req.Password),
            SpecialtyId = req.SpecialtyId,
            LicenseNumber = req.LicenseNumber,
            Biography = req.Biography
        };
        await doctorRepository.AddAsync(doctor);
        
        foreach (var s in slots)
        {
            var slotEntity = new Slot
            {
                Doctor = doctor,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                IsAvailable = true
            };
            await slotRepository.AddAsync(slotEntity);
        }
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}