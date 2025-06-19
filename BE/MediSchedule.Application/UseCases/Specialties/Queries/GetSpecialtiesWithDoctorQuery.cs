using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Specialties.Queries;

public record GetSpecialtiesWithDoctorQuery(Guid HospitalId) : IRequest<IEnumerable<SpecialtyWithDoctorResponse>>;