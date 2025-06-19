using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Specialties.Queries;

public record GetSpecialtiesQuery(SpecialtyFilter Filter) : IRequest<IEnumerable<SpecialtyResponse>>;