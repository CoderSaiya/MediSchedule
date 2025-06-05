using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Profiles.Queries;

public record GetDoctorProfileQuery(
    Guid DoctorId
    ) : IRequest<DoctorProfileResponse>;