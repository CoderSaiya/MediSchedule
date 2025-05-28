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
    IProfileRepository profileRepository,
    ISpecialtyRepository specialtyRepository,
    IAuthService authService,
    IBlobService blobService,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<CreateDoctorCommand, Unit>
{
    public async Task<Unit> Handle(CreateDoctorCommand cmd, CancellationToken ct)
    {
        var req = cmd.Request;
        
        if (await userRepository.ExistsAsync(u => u.Email == req.Email) || 
            await userRepository.ExistsAsync(u => u.Username == req.Username))
            throw new Exception("User already exist");
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
                    throw new Exception($"Slot {i+1} overlaps with date {slots[j].Day} slot {j+1}.");
            }
        }
        
        foreach (var s in slots)
        {
            bool conflict = await slotRepository.ExistsAsync(ex =>
                ex.Doctor.SpecialtyId == req.SpecialtyId &&
                ex.Day == s.Day &&
                ex.StartTime < s.EndTime &&
                s.StartTime < ex.EndTime);
            
            Console.WriteLine("CMM" + conflict);
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

        var url = await blobService.UploadFileAsync("avatars", req.AvatarFile);

        var profile = new Profile
        {
            UserId = doctor.Id,
            FullName = req.FullName,
            AvatarUrl = url
        };
        await profileRepository.AddAsync(profile);
        
        foreach (var s in slots)
        {
            var slotEntity = new Slot
            {
                Doctor = doctor,
                Day = s.Day,
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