using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Hospitals.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Hospitals.Handlers;

public class GetHospitalsHandler(
    IHospitalRepository hospitalRepository
) : IRequestHandler<GetHospitalsQuery, IEnumerable<HospitalResponse>>
{
    public async Task<IEnumerable<HospitalResponse>> Handle(GetHospitalsQuery request, CancellationToken cancellationToken) =>
        (await hospitalRepository.ListAsync()).Select(hospital => new HospitalResponse(
            Id: hospital.Id,
            Name: hospital.Name,
            Phone: hospital.Phone,
            Email: hospital.Email,
            Description: hospital.Description,
            Coordinates: hospital.Coordinates,
            Specialties: hospital.Doctors.Select(d => d.Specialty.Name).ToList(),
            Image: hospital.CoverImage,
            CreatedAt: hospital.CreatedAt.ToString("yyyy-MM-dd"),
            UpdatedAt: hospital.ModifyAt.ToString("yyyy-MM-dd")
            )).ToList();
}