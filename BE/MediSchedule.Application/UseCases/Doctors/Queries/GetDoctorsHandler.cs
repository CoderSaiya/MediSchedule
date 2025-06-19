using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Doctors.Queries;

public record GetDoctorsQuery() : IRequest<IEnumerable<DoctorResponse>>;