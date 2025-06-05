using System.Diagnostics;
using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Profiles.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Profiles.Handlers;

public class GetDoctorProfileHandler(IDoctorRepository doctorRepository) : IRequestHandler<GetDoctorProfileQuery, DoctorProfileResponse>
{
    public async Task<DoctorProfileResponse> Handle(GetDoctorProfileQuery request, CancellationToken cancellationToken)
    {
        var doctor = await doctorRepository.GetByIdAsync(request.DoctorId);
        
        if (doctor is null)
            return new DoctorProfileResponse(
                Name: "",
                Specialty: "",
                Avatar: ""
            );

        return new DoctorProfileResponse(
            Name: $"BS. {doctor.Profile!.FullName!}",
            Specialty: $"Chuyên khoa {doctor.Specialty.Name}",
            Avatar: doctor.Profile.AvatarUrl!
        );
    }
}