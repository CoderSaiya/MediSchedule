using MediatR;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Doctors.Queries;

public record GetDoctorByIdQuery(Guid Id) : IRequest<Doctor?>;