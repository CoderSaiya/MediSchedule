using MediatR;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Doctors.Queries;

public record GetDoctorsQuery(DoctorFilter Filter) : IRequest<IEnumerable<Doctor>>;