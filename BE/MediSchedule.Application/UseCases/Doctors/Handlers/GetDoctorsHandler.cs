using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Doctors.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class GetDoctorsHandler(IDoctorRepository doctorRepository) : IRequestHandler<GetDoctorsQuery, IEnumerable<DoctorResponse>>
{
    public async Task<IEnumerable<DoctorResponse>> Handle(GetDoctorsQuery request, CancellationToken cancellationToken)
        => (await doctorRepository.ListAsync()).Select(d => new DoctorResponse(
            Id: d.Id,
            Name: $"BS. {d.Profile?.FullName ?? d.Username}",
            Specialty: d.Specialty.Name,
            Rating: d.Reviews.Any()
                ? d.Reviews.Average(r => r.Rating)
                : 0.0,
            Reviews: d.Reviews.Count,
            Image: d.Profile?.AvatarUrl ?? string.Empty,
            Available: d.Slots.Any(s => s.IsAvailable)
            ));
}