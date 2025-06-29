using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Doctors.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using Microsoft.AspNetCore.Server.HttpSys;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class UpdateDoctorHandler(
    IDoctorRepository doctorRepository,
    ISpecialtyRepository specialtyRepository,
    IHospitalRepository hospitalRepository,
    ISlotRepository slotRepository,
    IUnitOfWork unitOfWork,
    IBlobService blobService,
    IAuthService authService
    ) : IRequestHandler<UpdateDoctorCommand, Unit>
{
    public async Task<Unit> Handle(UpdateDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = await doctorRepository.GetByIdAsync(request.DoctorId);
        if (doctor is null) 
            throw new Exception("Doctor not found");

        doctor.Profile!.FullName = string.IsNullOrWhiteSpace(request.FullName) ? doctor.Profile.FullName : request.FullName?.Trim();
        doctor.LicenseNumber = (string.IsNullOrWhiteSpace(request.LicenseNumber) ? doctor.LicenseNumber : request.LicenseNumber?.Trim()) ?? string.Empty;
        doctor.Biography = (string.IsNullOrWhiteSpace(request.Biography) ? doctor.Biography : request.Biography?.Trim()) ?? string.Empty;
        doctor.Username = string.IsNullOrWhiteSpace(request.Username) ? doctor.Username : request.Username.Trim();
        doctor.Password = string.IsNullOrWhiteSpace(request.Password) ? doctor.Password :authService.HashPassword(request.Password);
        
        if (request.SpecialtyId.HasValue)
        {
            var specialty = await specialtyRepository.GetByIdAsync(request.SpecialtyId.Value);
            if (specialty is null)
                throw new Exception($"Specialty with ID {request.SpecialtyId} not found");
            doctor.SpecialtyId = request.SpecialtyId.Value;
            doctor.Specialty = specialty;
        }
        
        if (request.HospitalId.HasValue)
        {
            var hospital = await hospitalRepository.GetByIdAsync(request.HospitalId.Value);
            if (hospital is null)
                throw new Exception($"Hospital with ID {request.HospitalId} not found");
            doctor.HospitalId = request.HospitalId.Value;
            doctor.Hospital = hospital;
        }
        
        if (request.AvatarFile is not null && request.AvatarFile.Length > 0)
        {
            if (!string.IsNullOrWhiteSpace(doctor.Profile.AvatarUrl))
            {
                try
                {
                    await blobService.DeleteFileAsync(doctor.Profile.AvatarUrl);
                }
                catch
                {
                    // log
                }
            }
            var newUrl = await blobService.UploadFileAsync("doctors", request.AvatarFile);
            doctor.Profile.AvatarUrl = newUrl;
        }
        
        if (request.Slots is not null)
        {
            var requestSlots = request.Slots;
            
            foreach (var s in requestSlots)
            {
                if (s.EndTime <= s.StartTime)
                    throw new Exception($"Slot ngày {s.Day}: EndTime ({s.EndTime}) phải lớn hơn StartTime ({s.StartTime}).");
            }
            
            for (int i = 0; i < requestSlots.Count; i++)
            {
                var a = requestSlots[i];
                for (int j = i + 1; j < requestSlots.Count; j++)
                {
                    var b = requestSlots[j];
                    if (a.Day == b.Day &&
                        a.StartTime < b.EndTime &&
                        b.StartTime < a.EndTime)
                    {
                        throw new Exception(
                            $"Slot ngày {a.Day} từ {a.StartTime}–{a.EndTime} chồng lắp với {b.StartTime}–{b.EndTime}.");
                    }
                }
            }
            
            var existingSlots = doctor.Slots ?? new List<Slot>();
            
            if (requestSlots.Count == 0)
            {
                doctor.Slots.Clear();
            }
            else
            {
                var requestIds = requestSlots
                    .Where(s => s.Id.HasValue && s.Id.Value != Guid.Empty)
                    .Select(s => s.Id)
                    .ToHashSet();
                
                var toRemove = existingSlots
                    .Where(s => !requestIds.Contains(s.Id))
                    .ToList();
                foreach (var slot in toRemove)
                {
                    await slotRepository.DeleteAsync(slot.Id);
                }
                
                foreach (var slotDto in requestSlots)
                {
                    var slot = existingSlots.FirstOrDefault(ex =>
                        ex.Doctor.Id == doctor.Id &&
                        ex.Day == slotDto.Day &&
                        ex.StartTime < slotDto.EndTime &&
                        slotDto.StartTime < ex.EndTime);
                        
                    if (slot is not null)
                    {
                        slot.Day = slotDto.Day;
                        slot.StartTime = slotDto.StartTime;
                        slot.EndTime = slotDto.EndTime;
                    }
                    else
                    {
                        var newSlot = new Slot
                        {
                            DoctorId = doctor.Id,
                            Day = slotDto.Day,
                            StartTime = slotDto.StartTime,
                            EndTime = slotDto.EndTime,
                            IsAvailable = true
                        };
                        await slotRepository.AddAsync(newSlot);
                    }
                }
            }
        }
        
        await doctorRepository.UpdateAsync(doctor);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}