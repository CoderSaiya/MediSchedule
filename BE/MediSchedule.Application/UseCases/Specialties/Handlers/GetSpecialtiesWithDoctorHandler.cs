using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Specialties.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Specialties.Handlers;

public class GetSpecialtiesWithDoctorHandler(ISpecialtyRepository specialtyRepository) : IRequestHandler<GetSpecialtiesWithDoctorQuery, IEnumerable<SpecialtyWithDoctorResponse>>
{
    public async Task<IEnumerable<SpecialtyWithDoctorResponse>> Handle(GetSpecialtiesWithDoctorQuery request,
        CancellationToken cancellationToken)
        => (await specialtyRepository.ListAsync()).Select(s => new SpecialtyWithDoctorResponse(
            Id: s.Id,
            Name: s.Name,
            DoctorNames: s.Doctors
                .Where(d => d.HospitalId == request.HospitalId)
                .Select(d => new DoctorDto(
                    Id: d.Id,
                    Name: $"BS. {d.Profile?.FullName ?? d.Username}",
                    Speciality: s.Name
                ))
                .ToArray(),
            Amount: s.Amount
        ));
}